<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\DashboardController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware(['role:user'])->group(function () {
        Route::get('/questionnaire', [DashboardController::class, 'questionnaireList'])->name('questionnaire.list');
        Route::get('/questionnaire/{question}', [DashboardController::class, 'questionnaireDetail'])->name('questionnaire.detail');
        Route::post('/dashboard/submit-answer', [DashboardController::class, 'submitAnswer'])->name('submit_answer');
        Route::delete('/dashboard/evidence/{submission}', [DashboardController::class, 'deleteEvidence'])->name('delete_evidence');
    });

    // Admin CMS routes
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/assessments', [\App\Http\Controllers\AdminCMSController::class, 'centralManagement'])->name('admin.assessments');
        Route::get('/admin/users', [\App\Http\Controllers\AdminCMSController::class, 'userManagement'])->name('admin.users');
        Route::get('/admin/users/export', [\App\Http\Controllers\AdminCMSController::class, 'exportUsers'])->name('admin.users.export');
        Route::post('/admin/users', [\App\Http\Controllers\AdminCMSController::class, 'storeUser']);
        Route::post('/admin/users/bulk-delete', [\App\Http\Controllers\AdminCMSController::class, 'bulkDestroyUsers'])->name('admin.users.bulk_delete');
        Route::put('/admin/users/{user}', [\App\Http\Controllers\AdminCMSController::class, 'updateUser']);
        Route::delete('/admin/users/{user}', [\App\Http\Controllers\AdminCMSController::class, 'destroyUser']);

        Route::get('/admin/organizations', [\App\Http\Controllers\AdminCMSController::class, 'organizationManagement'])->name('admin.organizations');
        Route::post('/admin/organizations', [\App\Http\Controllers\AdminCMSController::class, 'storeOrganization']);
        Route::put('/admin/organizations/{organization}', [\App\Http\Controllers\AdminCMSController::class, 'updateOrganization']);
        Route::delete('/admin/organizations/{organization}', [\App\Http\Controllers\AdminCMSController::class, 'destroyOrganization']);

        Route::post('/admin/aspects', [\App\Http\Controllers\AdminCMSController::class, 'storeAspect']);
        Route::put('/admin/aspects/{aspect}', [\App\Http\Controllers\AdminCMSController::class, 'updateAspect']);
        Route::delete('/admin/aspects/{aspect}', [\App\Http\Controllers\AdminCMSController::class, 'destroyAspect']);

        Route::post('/admin/subaspects', [\App\Http\Controllers\AdminCMSController::class, 'storeSubAspect']);
        Route::put('/admin/subaspects/{subAspect}', [\App\Http\Controllers\AdminCMSController::class, 'updateSubAspect']);
        Route::delete('/admin/subaspects/{subAspect}', [\App\Http\Controllers\AdminCMSController::class, 'destroySubAspect']);

        Route::get('/admin/questions/create', [\App\Http\Controllers\AdminCMSController::class, 'createQuestion'])->name('admin.questions.create');
        Route::get('/admin/questions/{question}/edit', [\App\Http\Controllers\AdminCMSController::class, 'editQuestion'])->name('admin.questions.edit');
        Route::post('/admin/questions', [\App\Http\Controllers\AdminCMSController::class, 'storeQuestion']);
        Route::post('/admin/questions/{question}', [\App\Http\Controllers\AdminCMSController::class, 'updateQuestion']);
        Route::put('/admin/questions/{question}', [\App\Http\Controllers\AdminCMSController::class, 'updateQuestion']);
        Route::delete('/admin/questions/{question}', [\App\Http\Controllers\AdminCMSController::class, 'destroyQuestion']);

        Route::put('/admin/answers/{answer}/status', [DashboardController::class, 'updateAnswerStatus'])->name('admin.answers.status');
        Route::post('/admin/answers/bulk-status', [DashboardController::class, 'bulkUpdateAnswerStatus'])->name('admin.answers.bulk_status');
        Route::get('/admin/review/{user}', [\App\Http\Controllers\AdminCMSController::class, 'reviewOrganization'])->name('admin.review');
        Route::get('/admin/review/{user}/report.pdf', [\App\Http\Controllers\AdminCMSController::class, 'generateReport'])->name('admin.review.report');
        Route::post('/admin/switch-period', [\App\Http\Controllers\AdminCMSController::class, 'switchPeriod'])->name('admin.switch_period');
    });
});

require __DIR__.'/settings.php';
