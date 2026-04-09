<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Aspect;
use App\Models\SubAspect;
use App\Models\Question;
use App\Models\Option;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $org = Organization::create(['name' => 'Dinas Pendidikan Kearsipan Daerah']);

        // Admin
        User::updateOrCreate(['username' => 'admin', 'email' => 'admin@admin.com'], [
            'name' => 'Admin Pengelola',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // User
        User::updateOrCreate(['username' => 'user', 'email' => 'user@user.com'], [
            'name' => 'User Pelaksana',
            'password' => Hash::make('password'),
            'role' => 'user',
            'organization_id' => $org->id
        ]);

        // Create Aspect
        $aspect1 = Aspect::create([
            'name' => 'A. Penciptaan Arsip',
            'description' => 'Penilaian terhadap tata cara penciptaan arsip di lingkungan kerja.'
        ]);

        // Create Sub Aspek UK
        $subUp1 = SubAspect::create([
            'aspect_id' => $aspect1->id,
            'name' => '1. Pembuatan Tata Naskah Dinas',
            'type' => 'UP'
        ]);

        $subUk1 = SubAspect::create([
            'aspect_id' => $aspect1->id,
            'name' => '2. Registrasi Surat Masuk dan Keluar',
            'type' => 'UK'
        ]);

        // Create Questions for UP
        $q1 = Question::create([
            'sub_aspect_id' => $subUp1->id,
            'text' => 'Apakah Unit Pengelola telah membuat naskah dinas sesuai dengan pedoman Tata Naskah Dinas yang berlaku?',
            'instructions' => 'Periksa ketersediaan naskah dinas dan formatnya. Pastikan margin, jenis huruf, dan komponen surat sesuai aturan BKN/ANRI.',
            'example_file_path' => null
        ]);

        $options = [
            ['score' => 100, 'text' => 'Sesuai 100% dengan pedoman TND'],
            ['score' => 70, 'text' => 'Sesuai sebagian besar (76% - 99%) dengan pedoman TND'],
            ['score' => 50, 'text' => 'Sesuai sebagian (51% - 75%) dengan pedoman TND'],
            ['score' => 20, 'text' => 'Kurang sesuai (25% - 50%) dengan pedoman TND'],
            ['score' => 0, 'text' => 'Tidak sesuai dengan pedoman / Tidak ada naskah dinas']
        ];

        foreach ($options as $opt) {
            Option::create([
                'question_id' => $q1->id,
                'score' => $opt['score'],
                'text' => $opt['text']
            ]);
        }

        $q2 = Question::create([
            'sub_aspect_id' => $subUk1->id,
            'text' => 'Berapa persentase surat masuk/keluar yang telah diregistrasi dalam sistem/buku agenda?',
            'instructions' => 'Lampirkan bukti buku agenda atau hasil print out sistem aplikasi persuratan periode 1 tahun terakhir.',
        ]);

        foreach ($options as $opt) {
            Option::create([
                'question_id' => $q2->id,
                'score' => $opt['score'],
                'text' => str_replace('pedoman TND', 'jumlah surat yang teregistrasi', $opt['text'])
            ]);
        }

        // Add 1 more Aspect
        $aspect2 = Aspect::create([
            'name' => 'B. Penyimpanan Arsip',
            'description' => 'Penilaian terhadap sistem penyimpanan dan pemberkasan arsip aktif.'
        ]);

        $subUp2 = SubAspect::create([
            'aspect_id' => $aspect2->id,
            'name' => '1. Pemberkasan Arsip Aktif',
            'type' => 'UP'
        ]);

        $q3 = Question::create([
            'sub_aspect_id' => $subUp2->id,
            'text' => 'Apakah arsip aktif telah diberkas sesuai dengan Klasifikasi Arsip (KA)?',
            'instructions' => 'Lampirkan daftar arsip aktif dan dokumentasi foto filling cabinet atau odner.',
        ]);

        foreach ($options as $opt) {
            Option::create([
                'question_id' => $q3->id,
                'score' => $opt['score'],
                'text' => str_replace('pedoman TND', 'Klasifikasi Arsip', $opt['text'])
            ]);
        }
    }
}
