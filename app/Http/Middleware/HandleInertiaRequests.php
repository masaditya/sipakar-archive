<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $selectedPeriodId = session('selected_period_id');
        $periods = \App\Models\Period::orderBy('name', 'desc')->get();
        $currentPeriod = $periods->where('id', $selectedPeriodId)->first() 
                        ?? $periods->where('is_active', true)->first() 
                        ?? $periods->first();

        if ($currentPeriod && !$selectedPeriodId) {
            session(['selected_period_id' => $currentPeriod->id]);
        }

        return [
            ...parent::share($request),
            'name' => 'SIPAKAR',
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'periods' => $periods,
            'current_period' => $currentPeriod,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
