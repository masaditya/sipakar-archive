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
        // Calculate total statistics
        $totalUsers = \App\Models\User::where('role', 'user')->count();
        $totalOrgs = Organization::count();
        $totalQuestions = Question::count();
        $totalAspects = Aspect::count();

        // Get user progress and scores
        $usersProgress = \App\Models\User::where('role', 'user')->with(['organization', 'answers.option'])->get()->map(function($user) use ($totalQuestions) {
            $totalAnswered = $user->answers->count();
            $completedCount = $user->answers->where('status', 'completed')->count();
            
            // Only count score for completed answers
            $totalScore = $user->answers->where('status', 'completed')->sum(function($answer) {
                return $answer->option ? $answer->option->score : 0;
            });

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'organization' => $user->organization ? $user->organization->name : '-',
                'progress' => $totalQuestions > 0 ? round(($totalAnswered / $totalQuestions) * 100) : 0,
                'completed_progress' => $totalQuestions > 0 ? round(($completedCount / $totalQuestions) * 100) : 0,
                'score' => $totalScore
            ];
        });

        // Filter out users who haven't started (optional, maybe keep them all to see progress 0%) 
        // Let's sort by score descending
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
        $totalQuestions = Question::count();
        $answers = Answer::where('user_id', $user->id)->with('option')->get();
        $totalAnswered = $answers->count();
        
        // Sum only completed
        $totalScore = $answers->where('status', 'completed')->sum(fn($a) => $a->option ? $a->option->score : 0);
        $completedCount = $answers->where('status', 'completed')->count();
        $revisionCount = $answers->where('status', 'revision')->count();
        $submittedCount = $answers->where('status', 'submitted')->count();
        
        $progress = $totalQuestions > 0 ? round(($totalAnswered / $totalQuestions) * 100) : 0;

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'totalQuestions' => $totalQuestions,
                'totalAnswered' => $totalAnswered,
                'totalScore' => $totalScore,
                'progress' => $progress,
                'completedCount' => $completedCount,
                'revisionCount' => $revisionCount,
                'submittedCount' => $submittedCount,
            ],
            'organization' => $user->organization
        ]);
    }

    public function questionnaireList(Request $request)
    {
        $user = $request->user();
        $aspects = Aspect::with(['subAspects.questions.answers' => function($q) use ($user) {
            $q->where('user_id', $user->id);
        }])->get();

        return Inertia::render('User/QuestionList', [
            'aspects' => $aspects
        ]);
    }

    public function questionnaireDetail(Question $question, Request $request)
    {
        $user = $request->user();
        $question->load(['subAspect.aspect', 'options']);
        $answer = Answer::where('user_id', $user->id)
                    ->where('question_id', $question->id)
                    ->with('evidenceSubmissions')
                    ->first();

        return Inertia::render('User/QuestionDetail', [
            'question' => $question,
            'answer' => $answer
        ]);
    }

    public function submitAnswer(Request $request)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'option_id' => 'required|exists:options,id',
            'files.*' => 'nullable|file', // Can upload multiple evidence
        ]);

        $user = $request->user();

        // Check if already completed
        $existing = Answer::where('user_id', $user->id)->where('question_id', $validated['question_id'])->first();
        if ($existing && $existing->status === 'completed') {
             return redirect()->back()->with('error', 'Soal sudah difinalisasi dan tidak dapat diubah lagi.');
        }

        $answer = Answer::updateOrCreate(
            ['user_id' => $user->id, 'question_id' => $validated['question_id']],
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
        // Only admin can do this via middleware role:admin
        $validated = $request->validate([
            'status' => 'required|in:submitted,revision,completed'
        ]);

        $answer->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status jawaban diperbarui');
    }

    public function deleteEvidence(EvidenceSubmission $submission, Request $request)
    {
        $user = $request->user();
        
        // Ensure the file belongs to the user or admin
        if ($submission->answer->user_id !== $user->id && $user->role !== 'admin') {
            return redirect()->back()->with('error', 'Unauthorized.');
        }

        // Don't allow deletion if answer is already completed
        if ($submission->answer->status === 'completed' && $user->role !== 'admin') {
            return redirect()->back()->with('error', 'Jawaban sudah difinalisasi.');
        }

        // Delete from storage
        if (Storage::disk('public')->exists($submission->file_path)) {
            Storage::disk('public')->delete($submission->file_path);
        }

        $submission->delete();

        return redirect()->back()->with('success', 'File berhasil dihapus');
    }
}
