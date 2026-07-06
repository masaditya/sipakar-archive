<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Aspect;
use App\Models\SubAspect;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Organization;
use App\Models\Period;
use Illuminate\Support\Facades\Hash;
use App\Services\AssessmentScoreCalculator;
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

    public function bulkDestroyUsers(Request $request) {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);
        User::whereIn('id', $request->ids)->delete();
        return back()->with('success', count($request->ids) . ' users deleted.');
    }

    public function exportUsers() {
        $users = User::with('organization')->orderBy('name', 'asc')->get();
        
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=users_export_" . date('Y-m-d') . ".csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Nama', 'Username', 'Email', 'Role', 'Organisasi', 'Created At'];

        $callback = function() use($users, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($users as $user) {
                $row['ID']         = $user->id;
                $row['Nama']       = $user->name;
                $row['Username']   = $user->username;
                $row['Email']      = $user->email;
                $row['Role']       = $user->role;
                $row['Organisasi'] = $user->organization->name ?? '-';
                $row['Created At'] = $user->created_at;

                fputcsv($file, array_values($row));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
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
            'helper' => 'nullable|string',
            'scoring_mode' => 'required|in:required,optional',
            'example_files' => 'nullable|array',
            'example_files.*' => 'nullable|file',
            'options' => 'required|array|min:5',
            'options.*.score' => 'required|numeric',
            'options.*.text' => 'required|string',
            'options.*.excludes_from_scoring' => 'nullable|boolean',
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
            'helper' => $request->helper,
            'scoring_mode' => $validated['scoring_mode'],
            'example_file_paths' => $paths,
        ]);

        foreach ($validated['options'] as $opt) {
            $q->options()->create([
                'score' => $opt['score'],
                'text' => $opt['text'],
                'excludes_from_scoring' => filter_var($opt['excludes_from_scoring'] ?? false, FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        return redirect('/dashboard')->with('success', 'Question created successfully.');
    }

    public function updateQuestion(Request $request, Question $question) {
        $validated = $request->validate([
            'text' => 'required|string',
            'instructions' => 'nullable|string',
            'legal_basis' => 'nullable|string',
            'helper' => 'nullable|string',
            'scoring_mode' => 'required|in:required,optional',
            'example_files' => 'nullable|array',
            'example_files.*' => 'nullable|file',
            'existing_example_files' => 'nullable|array',
            'options' => 'required|array|min:5',
            'options.*.id' => 'nullable|exists:options,id',
            'options.*.score' => 'required|numeric',
            'options.*.text' => 'required|string',
            'options.*.excludes_from_scoring' => 'nullable|boolean',
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
            'helper' => $request->helper,
            'scoring_mode' => $validated['scoring_mode'],
            'example_file_paths' => $paths,
        ]);

        // Update options
        $existingOptionIds = collect($validated['options'])->pluck('id')->filter()->toArray();
        $question->options()->whereNotIn('id', $existingOptionIds)->delete();

        foreach ($validated['options'] as $opt) {
            $optionPayload = [
                'score' => $opt['score'],
                'text' => $opt['text'],
                'excludes_from_scoring' => filter_var($opt['excludes_from_scoring'] ?? false, FILTER_VALIDATE_BOOLEAN),
            ];

            if (isset($opt['id'])) {
                $question->options()->where('id', $opt['id'])->update($optionPayload);
            } else {
                $question->options()->create($optionPayload);
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

    public function updateUserAnswer(Request $request, User $user, Question $question)
    {
        $validated = $request->validate([
            'option_id' => [
                'required',
                'integer',
                Rule::exists('options', 'id')->where('question_id', $question->id),
            ],
        ]);

        $selectedPeriodId = session('selected_period_id');
        if (! $selectedPeriodId) {
            return redirect()->back()->with('error', 'Periode pengawasan aktif belum dipilih.');
        }

        $answer = Answer::where('user_id', $user->id)
            ->where('question_id', $question->id)
            ->where('period_id', $selectedPeriodId)
            ->first();

        if (! $answer) {
            return redirect()->back()->with('error', 'Pengguna belum menjawab soal ini.');
        }

        $answer->update([
            'option_id' => $validated['option_id'],
        ]);

        return redirect()->back()->with('success', 'Jawaban pengguna berhasil diperbarui.');
    }

    public function generateReport(Request $request, User $user) {
        $user->load('organization');
        $selectedPeriodId = session('selected_period_id');
        $aspects = Aspect::where('period_id', $selectedPeriodId)->with(['subAspects.questions.answers' => function($q) use ($user, $selectedPeriodId) {
            $q->where('user_id', $user->id)->where('period_id', $selectedPeriodId)->with('option');
        }])->get();

        $totals = app(AssessmentScoreCalculator::class)->computeTotals($aspects, completedOnly: true);
        $total_skor_up = $totals['up'];
        $total_skor_uk = $totals['uk'];

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

    public function generateRHAS(Request $request, User $user) {
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

    public function generateBab2(Request $request, User $user) {
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

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.bab2', compact('user', 'aspects'))
            ->setPaper([0, 0, 609.448, 935.433], 'landscape'); // Landscape F4
            
        $filename = 'BAB2-' . $type . '-' . $user->name . '.pdf';

        if ($request->has('download')) {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
    }

    private function getLevel(int $score): int {
        if ($score >= 100) return 4;
        if ($score >= 70)  return 3;
        if ($score >= 50)  return 2;
        if ($score >= 20)  return 1;
        return 0;
    }

    public function generateBab2Docx(Request $request, User $user) {
        $user->load('organization');
        $selectedPeriodId = session('selected_period_id');
        $type   = $request->input('type', 'UP');
        $upName = $request->input('up_name', ($type === 'UK'
            ? 'Sekretariat ' . ($user->organization->name ?? '')
            : 'Bidang '));

        $aspects = Aspect::where('period_id', $selectedPeriodId)
            ->whereHas('subAspects', fn($q) => $q->where('type', $type))
            ->with([
                'subAspects' => fn($q) => $q->where('type', $type),
                'subAspects.questions.answers' => fn($q) => $q
                    ->where('user_id', $user->id)
                    ->where('period_id', $selectedPeriodId)
                    ->with('option'),
            ])->get();

        $phpWord = new \PhpOffice\PhpWord\PhpWord();
        $phpWord->setDefaultFontName('Arial');
        $phpWord->setDefaultFontSize(10);

        // Landscape F4: 33.9cm x 24cm (pageSizeW/H override any preset)
        $section = $phpWord->addSection([
            'orientation'  => 'landscape',
            'pageSizeW'    => \PhpOffice\PhpWord\Shared\Converter::cmToTwip(33.9),
            'pageSizeH'    => \PhpOffice\PhpWord\Shared\Converter::cmToTwip(24),
            'marginTop'    => \PhpOffice\PhpWord\Shared\Converter::cmToTwip(1.5),
            'marginBottom' => \PhpOffice\PhpWord\Shared\Converter::cmToTwip(1.5),
            'marginLeft'   => \PhpOffice\PhpWord\Shared\Converter::cmToTwip(1.0),
            'marginRight'  => \PhpOffice\PhpWord\Shared\Converter::cmToTwip(1.0),
        ]);

        // --- Header ---
        $orgName  = strtoupper($user->organization->name ?? '');
        $nextYear = (int) date('Y') + 1;
        $hFont    = ['bold' => true, 'size' => 12, 'name' => 'Arial'];
        $centerPar = ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 0, 'spaceBefore' => 0];

        $section->addText('BAB II', $hFont, $centerPar);
        $section->addText('URAIAN HASIL PENGAWASAN KEARSIPAN INTERNAL', $hFont, $centerPar);
        $section->addText($orgName, $hFont, $centerPar);
        $section->addText('TAHUN ' . date('Y'), $hFont, $centerPar);
        $section->addTextBreak(1);

        // --- Column widths (twips) ---
        $colW = [
            \PhpOffice\PhpWord\Shared\Converter::cmToTwip(1.2),  // NO
            \PhpOffice\PhpWord\Shared\Converter::cmToTwip(9.0),  // ASPEK/KOMPONEN
            \PhpOffice\PhpWord\Shared\Converter::cmToTwip(6.5),  // KONDISI FAKTUAL
            \PhpOffice\PhpWord\Shared\Converter::cmToTwip(1.5),  // LEVEL
            \PhpOffice\PhpWord\Shared\Converter::cmToTwip(6.5),  // CATATAN TIM
            \PhpOffice\PhpWord\Shared\Converter::cmToTwip(6.5),  // REKOMENDASI
        ];
        $totalW = array_sum($colW);

        $phpWord->addTableStyle('mainTable', [
            'borderSize'       => 6,
            'borderColor'      => '000000',
            'cellMarginTop'    => 60,
            'cellMarginBottom' => 60,
            'cellMarginLeft'   => 80,
            'cellMarginRight'  => 80,
            'width'            => $totalW,
            'unit'             => 'dxa',
        ]);

        $table = $section->addTable('mainTable');

        // Font & paragraph presets
        $boldFont   = ['bold' => true,  'size' => 10, 'name' => 'Arial'];
        $normalFont = ['bold' => false, 'size' => 10, 'name' => 'Arial'];
        $left       = ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::START,  'spaceAfter' => 0];
        $center     = ['alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter' => 0];
        $cellHdr    = ['bgColor' => 'D1D5DB', 'valign' => 'center'];
        $cellNorm   = ['valign' => 'center'];

        // --- Table header row ---
        $headers = [
            'NO',
            'ASPEK/KOMPONEN/PERNYATAAN',
            'KONDISI FAKTUAL',
            'LEVEL',
            'CATATAN TIM PENGAWAS',
            'REKOMENDASI TAHUN ' . $nextYear,
        ];
        $table->addRow();
        foreach ($headers as $i => $hdr) {
            $table->addCell($colW[$i], $cellHdr)->addText($hdr, $boldFont, $center);
        }

        // --- Helper closures ---
        $removeBrackets = fn($text) => trim(preg_replace('/\[.*?\]\s*/', '', $text));

        $addQuestionRows = function ($qList) use ($table, $colW, $normalFont, $boldFont, $center, $left, $cellNorm, $removeBrackets) {
            $qi = 0;
            foreach ($qList as $q) {
                $qi++;
                $ans        = $q->answers->first();
                $kondisi    = $ans && $ans->option ? $ans->option->text : '-';
                $level      = $ans && $ans->option ? $this->getLevel($ans->option->score) : 0;
                $catatan    = $ans && $ans->notes        ? $ans->notes        : '';
                $rekomen    = $ans && $ans->recommendation ? $ans->recommendation : '';

                $table->addRow();
                $table->addCell($colW[0], $cellNorm)->addText($qi . '.', $normalFont, $center);
                $table->addCell($colW[1], $cellNorm)->addText($removeBrackets($q->text), $normalFont, $left);
                $table->addCell($colW[2], $cellNorm)->addText($kondisi,  $normalFont, $left);
                $table->addCell($colW[3], $cellNorm)->addText((string) $level, $normalFont, $center);
                $table->addCell($colW[4], $cellNorm)->addText($catatan,  $normalFont, $left);
                $table->addCell($colW[5], $cellNorm)->addText($rekomen,  $normalFont, $left);
            }
        };

        // --- Data rows ---
        $aspectIndex = 0;
        foreach ($aspects as $aspect) {
            $aspectIndex++;

            // Aspect header row — bold, colspan 5 on remaining cols
            $table->addRow();
            $table->addCell($colW[0], $cellNorm)->addText($aspectIndex . '.', $boldFont, $center);
            $table->addCell(array_sum(array_slice($colW, 1)), ['gridSpan' => 5, 'valign' => 'center'])
                  ->addText(strtoupper($removeBrackets($aspect->name)), $boldFont, $left);

            foreach ($aspect->subAspects as $subIdx => $sub) {
                $subNumber = $subIdx + 1;

                // Sub-aspect header row
                $table->addRow();
                $table->addCell($colW[0], $cellNorm)->addText($aspectIndex . '.' . $subNumber . '.', $boldFont, $center);
                $table->addCell(array_sum(array_slice($colW, 1)), ['gridSpan' => 5, 'valign' => 'center'])
                      ->addText('SUB-ASPEK ' . strtoupper($removeBrackets($sub->name)), $boldFont, $left);

                $questions    = $sub->questions;
                $elektronik   = $questions->filter(fn($q) => str_contains($q->text, '[BAGIAN ELEKTRONIK]'));
                $konvensional = $questions->filter(fn($q) => str_contains($q->text, '[BAGIAN KONVENSIONAL]'));
                $others       = $questions->reject(fn($q) => str_contains($q->text, '[BAGIAN ELEKTRONIK]') || str_contains($q->text, '[BAGIAN KONVENSIONAL]'));

                if ($elektronik->isNotEmpty()) {
                    $table->addRow();
                    $table->addCell($colW[0], $cellNorm)->addText('A.', $boldFont, $center);
                    $table->addCell(array_sum(array_slice($colW, 1)), ['gridSpan' => 5, 'valign' => 'center'])
                          ->addText('BAGIAN ELEKTRONIK', $boldFont, $left);
                    $addQuestionRows($elektronik);
                }

                if ($konvensional->isNotEmpty()) {
                    $prefix = $elektronik->isNotEmpty() ? 'B.' : 'A.';
                    $table->addRow();
                    $table->addCell($colW[0], $cellNorm)->addText($prefix, $boldFont, $center);
                    $table->addCell(array_sum(array_slice($colW, 1)), ['gridSpan' => 5, 'valign' => 'center'])
                          ->addText('BAGIAN KONVENSIONAL', $boldFont, $left);
                    $addQuestionRows($konvensional);
                }

                if ($others->isNotEmpty()) {
                    $addQuestionRows($others);
                }
            }
        }

        // --- Stream as download ---
        $filename = 'BAB2-' . $type . '-' . $user->name . '.docx';
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');

        $tempPath = tempnam(sys_get_temp_dir(), 'bab2_');
        $objWriter->save($tempPath);

        return response()->download($tempPath, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ])->deleteFileAfterSend(true);
    }

    public function downloadEvidenceZip(User $user)
    {
        $selectedPeriodId = session('selected_period_id');
        if (! $selectedPeriodId) {
            abort(400, 'Pilih periode aktif terlebih dahulu.');
        }

        $user->load('organization');

        $aspects = Aspect::where('period_id', $selectedPeriodId)
            ->with(['subAspects.questions.answers' => function ($q) use ($user, $selectedPeriodId) {
                $q->where('user_id', $user->id)
                    ->where('period_id', $selectedPeriodId)
                    ->with('evidenceSubmissions');
            }])
            ->get();

        $tempDir = storage_path('app/temp');
        if (! is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $zipPath = $tempDir.DIRECTORY_SEPARATOR.'evidence-'.$user->id.'-'.uniqid('', true).'.zip';
        $zip = new \ZipArchive;
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Gagal membuat arsip ZIP.');
        }

        $entryCount = 0;
        $disk = \Illuminate\Support\Facades\Storage::disk('public');

        foreach ($aspects as $aspect) {
            $aspectFolder = $this->sanitizeZipPathSegment($aspect->name);

            foreach ($aspect->subAspects as $sub) {
                $subFolder = $this->sanitizeZipPathSegment($sub->name);
                $usedQuestionFolders = [];

                foreach ($sub->questions as $question) {
                    $questionFolder = $this->sanitizeZipPathSegment(strip_tags($question->text));
                    if (isset($usedQuestionFolders[$questionFolder])) {
                        $questionFolder .= ' ('.$question->id.')';
                    } else {
                        $usedQuestionFolders[$questionFolder] = true;
                    }

                    $basePath = str_replace('\\', '/', "{$aspectFolder}/{$subFolder}/{$questionFolder}");
                    $answer = $question->answers->first();
                    $usedFileNames = [];
                    $addedFiles = 0;

                    if ($answer) {
                        foreach ($answer->evidenceSubmissions as $evidence) {
                            if (! $disk->exists($evidence->file_path)) {
                                continue;
                            }

                            $absolutePath = $disk->path($evidence->file_path);
                            if (! is_readable($absolutePath)) {
                                continue;
                            }

                            $entryName = $this->uniqueZipFileName($evidence->original_name, $usedFileNames);
                            $usedFileNames[] = $entryName;
                            $entryPath = "{$basePath}/{$entryName}";

                            if ($zip->addFile($absolutePath, $entryPath) === true) {
                                $addedFiles++;
                            }
                        }
                    }

                    if ($addedFiles === 0) {
                        if ($zip->addEmptyDir($basePath) === true) {
                            $entryCount++;
                        }
                    } else {
                        $entryCount += $addedFiles;
                    }
                }
            }
        }

        if ($zip->close() !== true) {
            @unlink($zipPath);
            abort(500, 'Gagal menyelesaikan arsip ZIP.');
        }

        if ($entryCount === 0 || ! is_file($zipPath) || filesize($zipPath) < 22) {
            @unlink($zipPath);
            abort(404, 'Tidak ada data kuisioner untuk diunduh.');
        }

        $verifyZip = new \ZipArchive;
        $verifyOpened = $verifyZip->open($zipPath);
        if ($verifyOpened !== true || $verifyZip->numFiles === 0) {
            if ($verifyOpened === true) {
                $verifyZip->close();
            }
            @unlink($zipPath);
            abort(500, 'Arsip ZIP tidak valid.');
        }
        $verifyZip->close();

        $orgName = $user->organization->name ?? $user->name;
        $zipFilename = 'Bukti-Dukung-'.$this->sanitizeZipPathSegment($orgName).'.zip';
        $zipBinary = file_get_contents($zipPath);
        @unlink($zipPath);

        if ($zipBinary === false || strlen($zipBinary) < 22) {
            abort(500, 'Gagal membaca arsip ZIP.');
        }

        return response($zipBinary, 200, [
            'Content-Type' => 'application/zip',
            'Content-Disposition' => 'attachment; filename="'.$zipFilename.'"',
            'Content-Length' => strlen($zipBinary),
            'Content-Transfer-Encoding' => 'binary',
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
            'Pragma' => 'no-cache',
        ]);
    }

    private function sanitizeZipPathSegment(string $name): string
    {
        $name = html_entity_decode(strip_tags($name), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $name = preg_replace('/[<>:"\/\\\\|?*\x00-\x1F]/u', '', $name) ?? '';
        $name = preg_replace('/\s+/u', ' ', trim($name)) ?? '';

        $name = rtrim($name, ". \t");

        if ($name === '') {
            return 'Tanpa-Nama';
        }

        $reserved = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
        if (in_array(strtoupper($name), $reserved, true)) {
            $name = "_{$name}";
        }

        return mb_substr($name, 0, 120);
    }

    /**
     * @param  array<int, string>  $usedNames
     */
    private function uniqueZipFileName(string $originalName, array &$usedNames): string
    {
        $baseName = $this->sanitizeZipPathSegment($originalName);
        if (! in_array($baseName, $usedNames, true)) {
            return $baseName;
        }

        $ext = pathinfo($baseName, PATHINFO_EXTENSION);
        $name = pathinfo($baseName, PATHINFO_FILENAME);
        $counter = 2;

        do {
            $candidate = $ext !== '' && $ext !== $baseName
                ? "{$name} ({$counter}).{$ext}"
                : "{$baseName} ({$counter})";
            $counter++;
        } while (in_array($candidate, $usedNames, true));

        return $candidate;
    }

    public function switchPeriod(Request $request) {
        $validated = $request->validate([
            'period_id' => 'required|exists:periods,id'
        ]);
        session(['selected_period_id' => $validated['period_id']]);
        return back()->with('success', 'Periode pengawasan berhasil diubah.');
    }

    public function resetAnswers(Request $request) {
        $selectedPeriodId = session('selected_period_id');
        
        if (!$selectedPeriodId) {
            return back()->with('error', 'Pilih periode aktif terlebih dahulu.');
        }

        $userId = $request->input('user_id');
        $organizationId = $request->input('organization_id');

        $query = \App\Models\Answer::where('period_id', $selectedPeriodId);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($organizationId) {
            $query->whereHas('user', function($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            });
        }

        // Get matching answers
        $answers = $query->get();
        $answerIds = $answers->pluck('id');

        if ($answers->isEmpty()) {
            return back()->with('success', 'Tidak ada data jawaban untuk dikosongkan.');
        }

        // Delete evidence files
        $submissions = \App\Models\EvidenceSubmission::whereIn('answer_id', $answerIds)->get();
        foreach ($submissions as $sub) {
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($sub->file_path)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($sub->file_path);
            }
            $sub->delete();
        }

        // Delete answers
        \App\Models\Answer::whereIn('id', $answerIds)->delete();

        $message = 'Seluruh jawaban telah dikosongkan.';
        if ($userId) {
            $user = \App\Models\User::find($userId);
            $message = 'Jawaban untuk user ' . ($user->name ?? $userId) . ' telah dikosongkan.';
        } elseif ($organizationId) {
            $org = \App\Models\Organization::find($organizationId);
            $message = 'Seluruh jawaban untuk organisasi ' . ($org->name ?? $organizationId) . ' telah dikosongkan.';
        }

        return back()->with('success', $message);
    }
}
