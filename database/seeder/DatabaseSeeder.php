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
            'name' => 'Periode 2025',
            'year' => 2025,
            'description' => 'Periode Pengawasan Kearsipan Tahun 2025'
        ]);

        $org = Organization::firstOrCreate(['name' => 'Dinas Pendidikan Kearsipan Daerah']);

        // 2. Users
        // Admin
        User::updateOrCreate(['username' => 'admin'], [
            'name' => 'Admin Pengelola',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // User
        User::updateOrCreate(['username' => 'user'], [
            'name' => 'User Pelaksana',
            'email' => 'user@user.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'organization_id' => $org->id
        ]);

        // 3. Core Content (Aspects, SubAspects, Questions, Options)
        $this->call([
            AspectAndSubAspectSeeder::class,
            QuestionAndOptionSeeder::class,
            UserPerOrganizationSeeder::class,
        ]);
    }
}
