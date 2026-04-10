<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Period;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Initial Data (Period & Organizations)
        $activePeriod = Period::updateOrCreate(['is_active' => true], [
            'name' => 'Periode 2025'
        ]);

        // 2. Load Organizations and Users
        $this->call([
            OrganizationAndUserSeeder::class,
        ]);

        // 3. Core Content (Aspects, SubAspects, Questions, Options)
        $this->call([
            AspectAndSubAspectSeeder::class,
            QuestionAndOptionSeeder::class,
            UserPerOrganizationSeeder::class,
        ]);
    }
}
