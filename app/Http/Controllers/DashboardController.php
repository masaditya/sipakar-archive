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
        $aspects = Aspect::where('period_id', $periodId)->with('subAspects.questions.answers', function($q) use ($user, $periodId) {
            $q->where('user_id', $user->id)->where('period_id', $periodId)->with('option');
        })->get();

        $finalScore = 0;

        foreach ($aspects as $aspect) {
            $aspectWeightedScore = 0;
            $aspectWeight = $aspect->score_weight ?? 0;

            foreach ($aspect->subAspects as $subAspect) {
                $subAspectWeight = $subAspect->score_weight ?? 0;
                $questions = $subAspect->questions;
                $questionCount = $questions->count();

                if ($questionCount > 0) {
                    $subAspectRawScore = 0;
                    foreach ($questions as $question) {
                        // Find the answer for this user in this period
                        $answer = $question->answers->first();
                        if ($answer && $answer->status === 'completed' && $answer->option) {
                            $subAspectRawScore += $answer->option->score;
                        }
                    }
                    $subAspectAverage = $subAspectRawScore / $questionCount;
                    $aspectWeightedScore += ($subAspectAverage * $subAspectWeight / 100);
                }
            }
            $finalScore += ($aspectWeightedScore * $aspectWeight / 100);
        }

        return $finalScore;
    }

    public function questionnaireList(Request $request)
    {
        $user = $request->user();
        $selectedPeriodId = session('selected_period_id');
        $aspects = Aspect::where('period_id', $selectedPeriodId)->with(['subAspects.questions.answers' => function($q) use ($user, $selectedPeriodId) {
            $q->where('user_id', $user->id)->where('period_id', $selectedPeriodId);
        }])->get();

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

        return redirect()->back()->with('success', 'Jawaban berhasil disimpan');
    }

    public function updateAnswerStatus(Request $request, Answer $answer)
    {
        $validated = $request->validate([
            'status' => 'required|in:submitted,revision,completed'
        ]);

        $answer->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status jawaban diperbarui');
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
}
