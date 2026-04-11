<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Aspect;
use App\Models\SubAspect;
use App\Models\Question;
use App\Models\Organization;
use App\Models\Period;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminCMSController extends Controller
{
    public function userManagement(Request $request) {
        $search = $request->input('search');
        $users = User::query()
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();
            
        $organizations = Organization::orderBy('name', 'asc')->get();
        return \Inertia\Inertia::render('Admin/UserManagement', [
            'users' => $users,
            'organizations' => $organizations,
            'filters' => $request->only(['search'])
        ]);
    }

    public function centralManagement() {
        $selectedPeriodId = session('selected_period_id');
        $aspects = Aspect::where('period_id', $selectedPeriodId)->with('subAspects.questions.options')->get();
        $organizations = Organization::all();
        return \Inertia\Inertia::render('Admin/CentralManagement', [
            'aspects' => $aspects,
            'organizations' => $organizations
        ]);
    }

    // === ORGANIZATION CRUD ===
    public function organizationManagement(Request $request) {
        $search = $request->input('search');
        $organizations = Organization::query()
            ->when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('type', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
            })
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return \Inertia\Inertia::render('Admin/OrganizationManagement', [
            'organizations' => $organizations,
            'filters' => $request->only(['search'])
        ]);
    }
    public function storeOrganization(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'head_name' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);
        Organization::create($validated);
        return back()->with('success', 'Organization created.');
    }
    public function updateOrganization(Request $request, Organization $organization) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'head_name' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);
        $organization->update($validated);
        return back()->with('success', 'Organization updated.');
    }
    public function destroyOrganization(Organization $organization) {
        $organization->delete();
        return back()->with('success', 'Organization deleted.');
    }

    // === USER CRUD ===
    public function storeUser(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,user',
            'organization_id' => 'nullable|exists:organizations,id'
        ]);
        $validated['password'] = Hash::make($validated['password']);
        User::create($validated);
        return back()->with('success', 'User created.');
    }
    public function updateUser(Request $request, User $user) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required','string','max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['required','string','email','max:255', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|in:admin,user',
            'organization_id' => 'nullable|exists:organizations,id',
            'password' => 'nullable|string|min:8'
        ]);
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        $user->update($validated);
        return back()->with('success', 'User updated.');
    }
    public function destroyUser(User $user) {
        $user->delete();
        return back()->with('success', 'User deleted.');
    }

    // === ASPECT CRUD ===
    public function storeAspect(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'score_weight' => 'nullable|numeric|min:0|max:100'
        ]);
        $validated['period_id'] = session('selected_period_id');
        Aspect::create($validated);
        return back()->with('success', 'Aspect created.');
    }
    public function updateAspect(Request $request, Aspect $aspect) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'score_weight' => 'nullable|numeric|min:0|max:100'
        ]);
        $aspect->update($validated);
        return back()->with('success', 'Aspect updated.');
    }
    public function destroyAspect(Aspect $aspect) {
        $aspect->delete();
        return back()->with('success', 'Aspect deleted.');
    }

    // === SUBASPECT CRUD ===
    public function storeSubAspect(Request $request) {
        $validated = $request->validate([
            'aspect_id' => 'required|exists:aspects,id',
            'name' => 'required|string|max:255',
            'type' => 'required|in:UP,UK',
            'score_weight' => 'nullable|numeric|min:0|max:100'
        ]);
        SubAspect::create($validated);
        return back()->with('success', 'SubAspect created.');
    }
    public function updateSubAspect(Request $request, SubAspect $subAspect) {
        $validated = $request->validate([
            'aspect_id' => 'required|exists:aspects,id',
            'name' => 'required|string|max:255',
            'type' => 'required|in:UP,UK',
            'score_weight' => 'nullable|numeric|min:0|max:100'
        ]);
        $subAspect->update($validated);
        return back()->with('success', 'SubAspect updated.');
    }
    public function destroySubAspect(SubAspect $subAspect) {
        $subAspect->delete();
        return back()->with('success', 'SubAspect deleted.');
    }

    // === QUESTION CRUD ===
    public function createQuestion(Request $request) {
        return \Inertia\Inertia::render('Admin/QuestionForm', [
            'sub_aspect_id' => $request->sub_aspect_id
        ]);
    }

    public function editQuestion(Question $question) {
        $question->load('options');
        return \Inertia\Inertia::render('Admin/QuestionForm', [
            'question' => $question,
            'sub_aspect_id' => $question->sub_aspect_id
        ]);
    }

    public function storeQuestion(Request $request) {
        $validated = $request->validate([
            'sub_aspect_id' => 'required|exists:sub_aspects,id',
            'text' => 'required|string',
            'instructions' => 'nullable|string',
            'legal_basis' => 'nullable|string',
            'example_files' => 'nullable|array',
            'example_files.*' => 'nullable|file',
            'options' => 'required|array|min:5',
            'options.*.score' => 'required|numeric',
            'options.*.text' => 'required|string'
        ]);

        $paths = [];
        if ($request->hasFile('example_files')) {
            foreach($request->file('example_files') as $file) {
                $paths[] = [
                    'path' => $file->store('evidence', 'public'),
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType()
                ];
            }
        }

        $q = Question::create([
            'sub_aspect_id' => $validated['sub_aspect_id'],
            'text' => $validated['text'],
            'instructions' => $validated['instructions'],
            'legal_basis' => $validated['legal_basis'],
            'example_file_paths' => $paths
        ]);
        
        foreach($validated['options'] as $opt) {
            $q->options()->create($opt);
        }

        return redirect('/dashboard')->with('success', 'Question created successfully.');
    }

    public function updateQuestion(Request $request, Question $question) {
        $validated = $request->validate([
            'text' => 'required|string',
            'instructions' => 'nullable|string',
            'legal_basis' => 'nullable|string',
            'example_files' => 'nullable|array',
            'example_files.*' => 'nullable|file',
            'existing_example_files' => 'nullable|array',
            'options' => 'required|array|min:5',
            'options.*.id' => 'nullable|exists:options,id',
            'options.*.score' => 'required|numeric',
            'options.*.text' => 'required|string'
        ]);

        $paths = $request->input('existing_example_files', []);
        
        if ($request->hasFile('example_files')) {
            foreach($request->file('example_files') as $file) {
                $paths[] = [
                    'path' => $file->store('evidence', 'public'),
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType()
                ];
            }
        }

        $question->update([
            'text' => $validated['text'],
            'instructions' => $validated['instructions'],
            'legal_basis' => $validated['legal_basis'],
            'example_file_paths' => $paths
        ]);

        // Update options
        $existingOptionIds = collect($validated['options'])->pluck('id')->filter()->toArray();
        $question->options()->whereNotIn('id', $existingOptionIds)->delete();

        foreach($validated['options'] as $opt) {
            if (isset($opt['id'])) {
                $question->options()->where('id', $opt['id'])->update([
                    'score' => $opt['score'],
                    'text' => $opt['text']
                ]);
            } else {
                $question->options()->create([
                    'score' => $opt['score'],
                    'text' => $opt['text']
                ]);
            }
        }

        return redirect('/dashboard')->with('success', 'Question updated successfully.');
    }

    public function destroyQuestion(Question $question) {
        $question->delete();
        return back()->with('success', 'Question deleted.');
    }

    public function reviewOrganization(User $user) {
        $user->load('organization');
        $selectedPeriodId = session('selected_period_id');
        $aspects = Aspect::where('period_id', $selectedPeriodId)->with(['subAspects.questions.answers' => function($q) use ($user, $selectedPeriodId) {
            $q->where('user_id', $user->id)->where('period_id', $selectedPeriodId)->with('evidenceSubmissions', 'option');
        }, 'subAspects.questions.options'])->get();

        return \Inertia\Inertia::render('Admin/ReviewAssessment', [
            'pelaksana' => $user,
            'aspects' => $aspects
        ]);
    }

    public function generateReport(Request $request, User $user) {
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
            'terbilang_nilai_akhir' => ucwords(\Riskihajar\Terbilang\Facades\Terbilang::make($formatted_nilai)),
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.assessment-report', compact('user', 'aspects', 'inputs'))
            ->setPaper([0, 0, 609.448, 935.433], 'portrait'); // F4 (Folio) paper size (215 x 330 mm)
            
        if ($request->has('download')) {
            return $pdf->download('Laporan-Pengawasan-'.$user->name.'.pdf');
        }

        return $pdf->stream('Laporan-Pengawasan-'.$user->name.'.pdf');
    }

    public function switchPeriod(Request $request) {
        $validated = $request->validate([
            'period_id' => 'required|exists:periods,id'
        ]);
        session(['selected_period_id' => $validated['period_id']]);
        return back()->with('success', 'Periode pengawasan berhasil diubah.');
    }
}
