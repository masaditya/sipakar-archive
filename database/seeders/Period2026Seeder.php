<?php

namespace Database\Seeders;

use App\Models\Period;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Period2026Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Temukan periode 2025 yang menjadi sumber data
        $oldPeriod = Period::where('name', 'Periode 2025')->first();
        
        if (!$oldPeriod) {
            $this->command->error("Data Periode 2025 tidak ditemukan! Pastikan sudah menjalankan DatabaseSeeder sebelumnya.");
            return;
        }

        // Mulai database transaction agar aman
        DB::transaction(function () use ($oldPeriod) {
            // Nonaktifkan periode lama
            Period::query()->update(['is_active' => false]);

            // Buat Periode 2026 yang baru
            $newPeriod = Period::create([
                'name' => 'Periode 2026',
                // Anda bisa menyesuaikan year atau properti lain bila diperlukan, 
                // schema saat ini hanya memiliki name dan is_active
                'is_active' => true 
            ]);

            $this->command->info("Duplikasi data dari {$oldPeriod->name} ke {$newPeriod->name} dimulai...");

            // Duplikasi Aspect
            foreach ($oldPeriod->aspects as $aspect) {
                $newAspect = $aspect->replicate();
                $newAspect->period_id = $newPeriod->id;
                $newAspect->save();

                // Duplikasi Sub Aspect
                foreach ($aspect->subAspects as $subAspect) {
                    $newSubAspect = $subAspect->replicate();
                    $newSubAspect->aspect_id = $newAspect->id;
                    $newSubAspect->save();

                    // Duplikasi Question
                    foreach ($subAspect->questions as $question) {
                        $newQuestion = $question->replicate();
                        $newQuestion->sub_aspect_id = $newSubAspect->id;
                        $newQuestion->save();

                        // Duplikasi Option
                        foreach ($question->options as $option) {
                            $newOption = $option->replicate();
                            $newOption->question_id = $newQuestion->id;
                            $newOption->save();
                        }
                    }
                }
            }

            $this->command->info("Data berhasil digandakan ke Periode 2026!");
        });
    }
}
