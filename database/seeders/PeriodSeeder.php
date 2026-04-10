<?php

namespace Database\Seeders;

use App\Models\Period;
use App\Models\Aspect;
use App\Models\Answer;
use Illuminate\Database\Seeder;

class PeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $p2025 = Period::create(['name' => '2025', 'is_active' => false]);
        $p2026 = Period::create(['name' => '2026', 'is_active' => true]);

        // Assign existing data to 2026 (assuming current work is for 2026)
        Aspect::whereNull('period_id')->update(['period_id' => $p2026->id]);
        Answer::whereNull('period_id')->update(['period_id' => $p2026->id]);
    }
}
