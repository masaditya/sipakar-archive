<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Support\Collection;

class AssessmentScoreCalculator
{
    /**
     * Soal opsional tidak masuk penilaian jika belum dijawab atau opsi excludes_from_scoring dipilih.
     *
     * @param  Collection<int, Question>  $questions
     */
    public function questionsCountedInScoring(Collection $questions): Collection
    {
        return $questions->filter(function (Question $question) {
            if (($question->scoring_mode ?? 'required') !== 'optional') {
                return true;
            }

            $answer = $question->answers->first();
            if (! $answer?->option) {
                return false;
            }

            return ! $answer->option->excludes_from_scoring;
        });
    }

    /**
     * @param  Collection<int, Question>  $questions
     */
    public function nilaiStandar(Collection $questions): int
    {
        return $this->questionsCountedInScoring($questions)->count() * 100;
    }

    /**
     * @param  Collection<int, Question>  $questions
     */
    public function totalNilai(Collection $questions, bool $completedOnly = false): int
    {
        $total = 0;

        foreach ($this->questionsCountedInScoring($questions) as $question) {
            $answer = $question->answers->first();
            if (! $answer?->option) {
                continue;
            }

            if ($completedOnly && $answer->status !== 'completed') {
                continue;
            }

            $total += $answer->option->score;
        }

        return $total;
    }

    public function subAspectSkor(Collection $questions, float $subBobot, bool $completedOnly = false): float
    {
        $nilaiStandar = $this->nilaiStandar($questions);
        if ($nilaiStandar <= 0) {
            return 0;
        }

        $nilai = $this->totalNilai($questions, $completedOnly);

        return ($nilai / $nilaiStandar) * $subBobot;
    }

    /**
     * @param  iterable<\App\Models\Aspect>  $aspects
     * @return array{up: float, uk: float}
     */
    public function computeTotals(iterable $aspects, bool $completedOnly = false): array
    {
        $totalSkorUp = 0;
        $totalSkorUk = 0;

        foreach ($aspects as $aspect) {
            $bobotAspek = $aspect->score_weight;

            $upSubAspects = $aspect->subAspects->where('type', 'UP');
            if ($upSubAspects->isNotEmpty()) {
                $subSkorSum = 0;
                foreach ($upSubAspects as $sub) {
                    $subSkorSum += $this->subAspectSkor($sub->questions, $sub->score_weight ?? 0, $completedOnly);
                }
                $totalSkorUp += $subSkorSum * ($bobotAspek / 100);
            }

            $ukSubAspects = $aspect->subAspects->where('type', 'UK');
            if ($ukSubAspects->isNotEmpty()) {
                $subSkorSum = 0;
                foreach ($ukSubAspects as $sub) {
                    $subSkorSum += $this->subAspectSkor($sub->questions, $sub->score_weight ?? 0, $completedOnly);
                }
                $totalSkorUk += $subSkorSum * ($bobotAspek / 100);
            }
        }

        return ['up' => $totalSkorUp, 'uk' => $totalSkorUk];
    }
}
