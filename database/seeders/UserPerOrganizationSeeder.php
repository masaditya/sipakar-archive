<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserPerOrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = Organization::all();
        $password = Hash::make('password');

        foreach ($organizations as $org) {
            // Check if user already exists for this org to prevent duplicates if run twice
            $exists = User::where('organization_id', $org->id)->exists();
            if ($exists) continue;

            $slug = Str::slug($org->name);
            $username = substr($slug, 0, 20) . '_' . $org->id;
            
            User::create([
                'name' => 'Operator ' . $org->name,
                'username' => $username,
                'email' => $username . '@sipakar.go.id',
                'password' => $password,
                'role' => 'user',
                'organization_id' => $org->id,
            ]);
        }
    }
}
