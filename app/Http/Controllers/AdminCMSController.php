<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Aspect;
use App\Models\SubAspect;
use App\Models\Question;
use App\Models\Organization;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminCMSController extends Controller
{
    public function userManagement(Request $request) {
        $users = User::all();
        $organizations = Organization::all();
        return \Inertia\Inertia::render('Admin/UserManagement', [
            'users' => $users,
            'organizations' => $organizations
        ]);
    }

    public function centralManagement() {
        $aspects = Aspect::with('subAspects.questions.options')->get();
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
            'description' => 'nullable|string'
        ]);
        Aspect::create($validated);
        return back()->with('success', 'Aspect created.');
    }
    public function updateAspect(Request $request, Aspect $aspect) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
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
            'type' => 'required|in:UP,UK'
        ]);
        SubAspect::create($validated);
        return back()->with('success', 'SubAspect created.');
    }
    public function updateSubAspect(Request $request, SubAspect $subAspect) {
        $validated = $request->validate([
            'aspect_id' => 'required|exists:aspects,id',
            'name' => 'required|string|max:255',
            'type' => 'required|in:UP,UK'
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
            'example_file' => 'nullable|file',
            'options' => 'required|array|min:5',
            'options.*.score' => 'required|numeric',
            'options.*.text' => 'required|string'
        ]);

        $path = null;
        if ($request->hasFile('example_file')) {
            $path = $request->file('example_file')->store('evidence', 'public');
        }

        $q = Question::create([
            'sub_aspect_id' => $validated['sub_aspect_id'],
            'text' => $validated['text'],
            'instructions' => $validated['instructions'],
            'legal_basis' => $validated['legal_basis'],
            'example_file_path' => $path
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
            'example_file' => 'nullable|file',
            'options' => 'required|array|min:5',
            'options.*.id' => 'nullable|exists:options,id',
            'options.*.score' => 'required|numeric',
            'options.*.text' => 'required|string'
        ]);

        $path = $question->example_file_path;
        if ($request->hasFile('example_file')) {
            $path = $request->file('example_file')->store('evidence', 'public');
        }

        $question->update([
            'text' => $validated['text'],
            'instructions' => $validated['instructions'],
            'legal_basis' => $validated['legal_basis'],
            'example_file_path' => $path
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
        $aspects = Aspect::with(['subAspects.questions.answers' => function($q) use ($user) {
            $q->where('user_id', $user->id)->with('evidenceSubmissions', 'option');
        }, 'subAspects.questions.options'])->get();

        return \Inertia\Inertia::render('Admin/ReviewAssessment', [
            'pelaksana' => $user,
            'aspects' => $aspects
        ]);
    }
}
