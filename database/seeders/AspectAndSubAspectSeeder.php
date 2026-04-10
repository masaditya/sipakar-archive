<?php

namespace Database\Seeders;

use App\Models\Aspect;
use App\Models\SubAspect;
use App\Models\Period;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AspectAndSubAspectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activePeriod = Period::where('is_active', true)->first();
        if (!$activePeriod) return;

        // Cleanup existing aspects for this period if any
        // Aspect::where('period_id', $activePeriod->id)->delete();

        // Data from SQL: d:\Dev\Internal\pengawasan\public\sialma_aspects_2026-04-09_171013.sql
        $aspectsData = [
            ['id' => 1, 'name' => '[UK] ASPEK PENGELOLAAN ARSIP DINAMIS', 'score_weight' => 60],
            ['id' => 2, 'name' => '[UK] ASPEK SUMBER DAYA KEARSIPAN', 'score_weight' => 40],
            ['id' => 3, 'name' => '[UP] ASPEK PENGELOLAAN ARSIP DINAMIS', 'score_weight' => 70],
            ['id' => 4, 'name' => '[UP] ASPEK SUMBER DAYA KEARSIPAN', 'score_weight' => 30],
        ];

        foreach ($aspectsData as $data) {
            Aspect::updateOrCreate(['id' => $data['id']], [
                'name' => $data['name'],
                'score_weight' => $data['score_weight'],
                'period_id' => $activePeriod->id,
                'description' => 'Diimpor dari SIALMA SQL'
            ]);
        }

        // Data from SQL: d:\Dev\Internal\pengawasan\public\sialma_sub_aspects_2026-04-09_171046.sql
        $subAspectsData = [
            ['id' => 11, 'aspect_id' => 1, 'name' => '[UK] SUB-ASPEK PENGENDALIAN NASKAH DINAS', 'score_weight' => 10, 'type' => 'UK'],
            ['id' => 12, 'aspect_id' => 1, 'name' => '[UK] SUB-ASPEK PENGGUNAAN', 'score_weight' => 25, 'type' => 'UK'],
            ['id' => 13, 'aspect_id' => 1, 'name' => '[UK] SUB-ASPEK PEMELIHARAAN', 'score_weight' => 35, 'type' => 'UK'],
            ['id' => 14, 'aspect_id' => 1, 'name' => '[UK] SUB-ASPEK PENYUSUTAN', 'score_weight' => 30, 'type' => 'UK'],
            ['id' => 15, 'aspect_id' => 2, 'name' => '[UK] SUB-ASPEK SUMBER DAYA MANUSIA KEARSIPAN', 'score_weight' => 50, 'type' => 'UK'],
            ['id' => 16, 'aspect_id' => 2, 'name' => '[UK] SUB-ASPEK SARANA DAN PRASARANA KEARSIPAN', 'score_weight' => 50, 'type' => 'UK'],
            ['id' => 17, 'aspect_id' => 3, 'name' => '[UP] SUB-ASPEK PENCIPTAAN', 'score_weight' => 20, 'type' => 'UP'],
            ['id' => 18, 'aspect_id' => 3, 'name' => '[UP] SUB-ASPEK PENGGUNAAN', 'score_weight' => 20, 'type' => 'UP'],
            ['id' => 19, 'aspect_id' => 3, 'name' => '[UP] SUB-ASPEK PEMELIHARAAN', 'score_weight' => 35, 'type' => 'UP'],
            ['id' => 20, 'aspect_id' => 3, 'name' => '[UP] SUB-ASPEK PENYUSUTAN', 'score_weight' => 25, 'type' => 'UP'],
            ['id' => 21, 'aspect_id' => 4, 'name' => '[UP] SUB-ASPEK SUMBER DAYA MANUSIA KEARSIPAN', 'score_weight' => 50, 'type' => 'UP'],
            ['id' => 22, 'aspect_id' => 4, 'name' => '[UP] SUB-ASPEK SARANA DAN PRASARANA', 'score_weight' => 50, 'type' => 'UP'],
        ];

        foreach ($subAspectsData as $data) {
            SubAspect::updateOrCreate(['id' => $data['id']], [
                'aspect_id' => $data['aspect_id'],
                'name' => $data['name'],
                'score_weight' => $data['score_weight'],
                'type' => $data['type']
            ]);
        }
    }
}
