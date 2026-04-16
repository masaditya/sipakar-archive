<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Aspect;
use App\Models\SubAspect;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Organization;
use App\Models\EvidenceSubmission;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            return $this->adminDashboard();
        }

        return $this->userDashboard($user);
    }

    private function adminDashboard()
    {
        $selectedPeriodId = session('selected_period_id');
        
        $totalUsers = \App\Models\User::where('role', 'user')->count();
        $totalOrgs = Organization::count();
        $totalQuestions = Question::whereHas('subAspect.aspect', function($q) use ($selectedPeriodId) {
            $q->where('period_id', $selectedPeriodId);
        })->count();
        $totalAspects = Aspect::where('period_id', $selectedPeriodId)->count();

        $usersProgress = \App\Models\User::where('role', 'user')->with(['organization', 'answers' => function($q) use ($selectedPeriodId) {
            $q->where('period_id', $selectedPeriodId)->with('option');
        }])->get()->map(function($user) use ($totalQuestions, $selectedPeriodId) {
            $totalAnswered = $user->answers->count();
            $completedCount = $user->answers->where('status', 'completed')->count();
            
            // Calculate weighted score
            $score = $this->calculateWeightedScore($user, $selectedPeriodId);

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'organization' => $user->organization ? $user->organization->name : '-',
                'progress' => $totalQuestions > 0 ? round(($totalAnswered / $totalQuestions) * 100) : 0,
                'completed_progress' => $totalQuestions > 0 ? round(($completedCount / $totalQuestions) * 100) : 0,
                'score' => round($score, 2)
            ];
        });

        $usersProgress = $usersProgress->sortByDesc('score')->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $totalUsers,
                'organizations' => $totalOrgs,
                'questions' => $totalQuestions,
                'aspects' => $totalAspects,
            ],
            'usersProgress' => $usersProgress
        ]);
    }

    private function userDashboard($user)
    {
        $selectedPeriodId = session('selected_period_id');
        $totalQuestions = Question::whereHas('subAspect.aspect', function($q) use ($selectedPeriodId) {
            $q->where('period_id', $selectedPeriodId);
        })->count();

        $answers = Answer::where('user_id', $user->id)
                    ->where('period_id', $selectedPeriodId)
                    ->with('option')
                    ->get();

        $totalAnswered = $answers->count();
        $score = $this->calculateWeightedScore($user, $selectedPeriodId);
        $completedCount = $answers->where('status', 'completed')->count();
        $revisionCount = $answers->where('status', 'revision')->count();
        $submittedCount = $answers->where('status', 'submitted')->count();
        
        $progress = $totalQuestions > 0 ? round(($totalAnswered / $totalQuestions) * 100) : 0;

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'totalQuestions' => $totalQuestions,
                'totalAnswered' => $totalAnswered,
                'totalScore' => round($score, 2),
                'progress' => $progress,
                'completedCount' => $completedCount,
                'revisionCount' => $revisionCount,
                'submittedCount' => $submittedCount,
            ],
            'organization' => $user->organization
        ]);
    }

    private function calculateWeightedScore($user, $periodId)
    {
        $aspects = Aspect::where('period_id', $periodId)->with(['subAspects.questions.answers' => function($q) use ($user, $periodId) {
            $q->where('user_id', $user->id)->where('period_id', $periodId)->with('option');
        }])->get();

        $total_skor_up = 0;
        $total_skor_uk = 0;

        foreach ($aspects as $aspect) {
            $bobotAspek = $aspect->score_weight;
            
            // UP Compute
            $upSubAspects = $aspect->subAspects->where('type', 'UP');
            if ($upSubAspects->isNotEmpty()) {
                $subSkorSum = 0;
                foreach ($upSubAspects as $sub) {
                    $questions = $sub->questions;
                    $nilaiStandar = $questions->count() * 100;
                    $totalNilai = 0;
                    foreach ($questions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->option) {
                            $totalNilai += $ans->option->score;
                        }
                    }
                    $subBobot = $sub->score_weight ?? 0;
                    $subSkor = $nilaiStandar > 0 ? ($totalNilai / $nilaiStandar) * $subBobot : 0;
                    $subSkorSum += $subSkor;
                }
                $total_skor_up += $subSkorSum * ($bobotAspek / 100);
            }

            // UK Compute
            $ukSubAspects = $aspect->subAspects->where('type', 'UK');
            if ($ukSubAspects->isNotEmpty()) {
                $subSkorSum = 0;
                foreach ($ukSubAspects as $sub) {
                    $questions = $sub->questions;
                    $nilaiStandar = $questions->count() * 100;
                    $totalNilai = 0;
                    foreach ($questions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->option) {
                            $totalNilai += $ans->option->score;
                        }
                    }
                    $subBobot = $sub->score_weight ?? 0;
                    $subSkor = $nilaiStandar > 0 ? ($totalNilai / $nilaiStandar) * $subBobot : 0;
                    $subSkorSum += $subSkor;
                }
                $total_skor_uk += $subSkorSum * ($bobotAspek / 100);
            }
        }

        return ($total_skor_up + $total_skor_uk) / 2;
    }

    public function questionnaireList(Request $request)
    {
        $user = $request->user();
        $selectedPeriodId = session('selected_period_id');
        $aspects = Aspect::where('period_id', $selectedPeriodId)
            ->with([
                'subAspects' => function($q) {
                    $q->orderByRaw("CASE WHEN type = 'UP' THEN 0 ELSE 1 END")->orderBy('id', 'asc');
                },
                'subAspects.questions.answers' => function($q) use ($user, $selectedPeriodId) {
                    $q->where('user_id', $user->id)->where('period_id', $selectedPeriodId);
                }
            ])
            ->orderByRaw("CASE WHEN type = 'Unit Pengolah' THEN 0 ELSE 1 END")
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('User/QuestionList', [
            'aspects' => $aspects
        ]);
    }

    public function questionnaireDetail(Question $question, Request $request)
    {
        $user = $request->user();
        $selectedPeriodId = session('selected_period_id');
        $question->load(['subAspect.aspect', 'options']);
        $answer = Answer::where('user_id', $user->id)
                    ->where('question_id', $question->id)
                    ->where('period_id', $selectedPeriodId)
                    ->with('evidenceSubmissions')
                    ->first();

        // Get adjacent questions
        $allQuestions = Question::whereHas('subAspect.aspect', function($q) use ($selectedPeriodId) {
            $q->where('period_id', $selectedPeriodId);
        })->orderBy('id', 'asc')->pluck('id');

        $currentIndex = $allQuestions->search($question->id);
        
        $prevId = $currentIndex > 0 ? $allQuestions[$currentIndex - 1] : null;
        $nextId = $currentIndex !== false && $currentIndex < $allQuestions->count() - 1 ? $allQuestions[$currentIndex + 1] : null;

        return Inertia::render('User/QuestionDetail', [
            'question' => $question,
            'answer' => $answer,
            'prevId' => $prevId,
            'nextId' => $nextId,
            'currentIndex' => $currentIndex !== false ? $currentIndex + 1 : 0,
            'totalCount' => $allQuestions->count()
        ]);
    }

    public function submitAnswer(Request $request)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'option_id' => 'required|exists:options,id',
            'files.*' => 'nullable|file',
        ]);

        $user = $request->user();
        $selectedPeriodId = session('selected_period_id');

        $existing = Answer::where('user_id', $user->id)
                        ->where('question_id', $validated['question_id'])
                        ->where('period_id', $selectedPeriodId)
                        ->first();

        if ($existing && $existing->status === 'completed') {
             return redirect()->back()->with('error', 'Soal sudah difinalisasi dan tidak dapat diubah lagi.');
        }

        $answer = Answer::updateOrCreate(
            ['user_id' => $user->id, 'question_id' => $validated['question_id'], 'period_id' => $selectedPeriodId],
            ['option_id' => $validated['option_id'], 'status' => 'submitted']
        );

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('evidence', 'public');
                $answer->evidenceSubmissions()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName()
                ]);
            }
        }

        if ($request->filled('next_id')) {
            return redirect()->route('questionnaire.detail', $request->input('next_id'))->with('success', 'Jawaban berhasil disimpan, beralih ke soal berikutnya.');
        }

        return redirect()->route('questionnaire.list')->with('success', 'Jawaban berhasil disimpan. Anda telah di penghujung kuisioner!');
    }

    public function updateAnswerStatus(Request $request, Answer $answer)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:submitted,revision,completed',
            'notes' => 'nullable|string',
            'recommendation' => 'nullable|string'
        ]);

        $answer->update($validated);

        return redirect()->back()->with('success', 'Status/Catatan jawaban diperbarui');
    }

    public function bulkUpdateAnswerStatus(Request $request)
    {
        $validated = $request->validate([
            'answer_ids' => 'required|array',
            'answer_ids.*' => 'exists:answers,id',
            'status' => 'required|in:submitted,revision,completed'
        ]);

        Answer::whereIn('id', $validated['answer_ids'])->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status massal berhasil diperbarui');
    }

    public function deleteEvidence(EvidenceSubmission $submission, Request $request)
    {
        $user = $request->user();
        if ($submission->answer->user_id !== $user->id && $user->role !== 'admin') {
            return redirect()->back()->with('error', 'Unauthorized.');
        }

        if ($submission->answer->status === 'completed' && $user->role !== 'admin') {
            return redirect()->back()->with('error', 'Jawaban sudah difinalisasi.');
        }

        if (Storage::disk('public')->exists($submission->file_path)) {
            Storage::disk('public')->delete($submission->file_path);
        }

        $submission->delete();

        return redirect()->back()->with('success', 'File berhasil dihapus');
    }

    public function generateReport(Request $request) {
        $user = $request->user();
        $user->load('organization');
        $selectedPeriodId = session('selected_period_id');
        $aspects = Aspect::where('period_id', $selectedPeriodId)->with(['subAspects.questions.answers' => function($q) use ($user, $selectedPeriodId) {
            $q->where('user_id', $user->id)->where('period_id', $selectedPeriodId)->with('option');
        }])->get();

        $total_skor_up = 0;
        $total_skor_uk = 0;

        foreach ($aspects as $aspect) {
            // UP Compute
            $upSubAspects = $aspect->subAspects->where('type', 'UP');
            if ($upSubAspects->isNotEmpty()) {
                $bobotAspek = $aspect->score_weight;
                $subSkorSum = 0;
                foreach ($upSubAspects as $sub) {
                    $subQuestions = $sub->questions;
                    $subNilaiStandar = $subQuestions->count() * 100;
                    $subNilai = 0;
                    foreach($subQuestions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->status === 'completed' && $ans->option) {
                            $subNilai += $ans->option->score;
                        }
                    }
                    $subBobot = $sub->score_weight ?? 0;
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * $subBobot : 0;
                    $subSkorSum += $subSkor;
                }
                $total_skor_up += $subSkorSum * ($bobotAspek / 100);
            }

            // UK Compute
            $ukSubAspects = $aspect->subAspects->where('type', 'UK');
            if ($ukSubAspects->isNotEmpty()) {
                $bobotAspek = $aspect->score_weight;
                $subSkorSum = 0;
                foreach ($ukSubAspects as $sub) {
                    $subQuestions = $sub->questions;
                    $subNilaiStandar = $subQuestions->count() * 100;
                    $subNilai = 0;
                    foreach($subQuestions as $q) {
                        $ans = $q->answers->first();
                        if ($ans && $ans->status === 'completed' && $ans->option) {
                            $subNilai += $ans->option->score;
                        }
                    }
                    $subBobot = $sub->score_weight ?? 0;
                    $subSkor = $subNilaiStandar > 0 ? ($subNilai / $subNilaiStandar) * $subBobot : 0;
                    $subSkorSum += $subSkor;
                }
                $total_skor_uk += $subSkorSum * ($bobotAspek / 100);
            }
        }

        $nilai_akhir = ($total_skor_up + $total_skor_uk) / 2;
        $formatted_nilai = number_format(round($nilai_akhir, 2), 2, '.', '');

        $inputs = [
            'up_name' => $request->input('up_name', '...'),
            'opd_name' => $request->input('opd_name', $user->organization->name ?? ''),
            'ttd1_jabatan' => 'KEPALA DINAS PERPUSTAKAAN DAN KEARSIPAN',
            'ttd1_nama' => 'ERICK FIRDAUS, ST.',
            'ttd1_pangkat' => 'Pembina Tingkat I',
            'ttd1_nip' => '19690726 200312 1 003',
            'ttd2_jabatan' => $request->input('ttd2_jabatan', 'KEPALA ' . strtoupper($user->organization->name ?? 'OPD')),
            'ttd2_nama' => $request->input('ttd2_nama', ''),
            'ttd2_pangkat' => $request->input('ttd2_pangkat', ''),
            'ttd2_nip' => $request->input('ttd2_nip', ''),
            'tanggal' => \Carbon\Carbon::now()->locale('id')->translatedFormat('d F Y'),
            'terbilang_nilai_akhir' => \Riskihajar\Terbilang\Facades\Terbilang::make($formatted_nilai) ? ucwords(\Riskihajar\Terbilang\Facades\Terbilang::make($formatted_nilai)) : '',
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.assessment-report', compact('user', 'aspects', 'inputs'))
            ->setPaper([0, 0, 609.448, 935.433], 'portrait');
            
        if ($request->has('download')) {
            return $pdf->download('Laporan-Pengawasan-'.$user->name.'.pdf');
        }

        return $pdf->stream('Laporan-Pengawasan-'.$user->name.'.pdf');
    }

    public function generateRHAS(Request $request) {
        $user = $request->user();
        $user->load('organization');
        $selectedPeriodId = session('selected_period_id');
        $type = $request->input('type', 'UP');

        $aspects = Aspect::where('period_id', $selectedPeriodId)
            ->whereHas('subAspects', function($q) use ($type) {
                $q->where('type', $type);
            })
            ->with(['subAspects' => function($q) use ($type) {
                $q->where('type', $type);
            }, 'subAspects.questions.answers' => function($q) use ($user, $selectedPeriodId) {
                $q->where('user_id', $user->id)->where('period_id', $selectedPeriodId)->with('option');
            }])->get();

        $inputs = [
            'type' => $type,
            'up_name' => $request->input('up_name', '...'),
            'opd_name' => $request->input('opd_name', $user->organization->name ?? ''),
            'ttd1_jabatan' => 'KEPALA DINAS PERPUSTAKAAN DAN KEARSIPAN',
            'ttd1_nama' => 'ERICK FIRDAUS, ST.',
            'ttd1_pangkat' => 'Pembina Tingkat I',
            'ttd1_nip' => '19690726 200312 1 003',
            'ttd2_jabatan' => $request->input('ttd2_jabatan', 'KEPALA ' . strtoupper($user->organization->name ?? 'OPD')),
            'ttd2_nama' => $request->input('ttd2_nama', ''),
            'ttd2_pangkat' => $request->input('ttd2_pangkat', ''),
            'ttd2_nip' => $request->input('ttd2_nip', ''),
            'tanggal' => \Carbon\Carbon::now()->locale('id')->translatedFormat('d F Y'),
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rhas', compact('user', 'aspects', 'inputs'))
            ->setPaper([0, 0, 609.448, 935.433], 'landscape'); // Landscape F4
            
        $filename = 'RHAS-' . $type . '-' . $user->name . '.pdf';

        if ($request->has('download')) {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
    }
}
