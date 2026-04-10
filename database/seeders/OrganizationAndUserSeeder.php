<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class OrganizationAndUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Clear existing organizations and users avoiding foreign key constraints
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Organization::truncate();
        User::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 2. Parse Organizations
        $orgSqlPath = 'C:\Users\arsip\Downloads\organizations_organizations_2026-04-10_091322.sql';
        if (File::exists($orgSqlPath)) {
            $orgSql = File::get($orgSqlPath);
            $orgs = $this->parseSqlValues($orgSql);

            foreach ($orgs as $org) {
                // (id, name, created_at, updated_at, type, address, phone, head_name, description)
                Organization::create([
                    'id'          => (int)$org[0],
                    'name'        => $this->stripQuotes($org[1]),
                    'type'        => $this->stripQuotes($org[4] ?? 'NULL'),
                    'address'     => $this->stripQuotes($org[5] ?? 'NULL'),
                    'phone'       => $this->stripQuotes($org[6] ?? 'NULL'),
                    'head_name'   => $this->stripQuotes($org[7] ?? 'NULL'),
                    'description' => $this->stripQuotes($org[8] ?? 'NULL'),
                ]);
            }
        }

        // 3. Parse Users
        $userSqlPath = public_path('users_users_2026-04-10_091333.sql');
        if (File::exists($userSqlPath)) {
            $userSql = File::get($userSqlPath);
            $users = $this->parseSqlValues($userSql);

            foreach ($users as $user) {
                // (id, name, username, email, email_verified_at, password, remember_token, created_at, updated_at, role, organization_id, ...)
                User::create([
                    'id'              => (int)$user[0],
                    'name'            => $this->stripQuotes($user[1]),
                    'username'        => $this->stripQuotes($user[2]),
                    'email'           => $this->stripQuotes($user[3]),
                    'password'        => $this->stripQuotes($user[5]),
                    'role'            => $this->stripQuotes($user[9]),
                    'organization_id' => $user[10] === 'null' ? null : (int)$user[10],
                ]);
            }
        }
    }

    /**
     * Primitive SQL values parser
     */
    private function parseSqlValues($sql)
    {
        if (preg_match('/INSERT INTO [^\(]+\([^\)]+\) VALUES\s*(.*);/i', $sql, $matches)) {
            $valuesContent = trim($matches[1]);
            
            $rows = [];
            $currentChar = '';
            $inString = false;
            $parenthesesLevel = 0;
            $currentRowContent = '';

            for ($i = 0; $i < strlen($valuesContent); $i++) {
                $char = $valuesContent[$i];
                
                if ($char === "'" && ($i === 0 || $valuesContent[$i-1] !== '\\')) {
                    $inString = !$inString;
                }

                if (!$inString) {
                    if ($char === '(') $parenthesesLevel++;
                    if ($char === ')') $parenthesesLevel--;
                }

                if ($char === ',' && $parenthesesLevel === 0 && !$inString) {
                    continue; 
                }

                $currentRowContent .= $char;

                if ($parenthesesLevel === 0 && !$inString && strlen(trim($currentRowContent)) > 0) {
                    $row = trim($currentRowContent);
                    if (str_starts_with($row, '(') && str_ends_with($row, ')')) {
                        $inner = substr($row, 1, -1);
                        $rows[] = $this->splitValues($inner);
                    }
                    $currentRowContent = '';
                }
            }
            return $rows;
        }
        return [];
    }

    private function splitValues($inner)
    {
        $fields = [];
        $currentField = '';
        $inString = false;
        
        for ($i = 0; $i < strlen($inner); $i++) {
            $char = $inner[$i];
            
            if ($char === "'" && ($i === 0 || $inner[$i-1] !== '\\')) {
                $inString = !$inString;
            }

            if ($char === ',' && !$inString) {
                $fields[] = trim($currentField);
                $currentField = '';
            } else {
                $currentField .= $char;
            }
        }
        $fields[] = trim($currentField);
        return $fields;
    }

    private function stripQuotes($str)
    {
        if ($str === 'NULL' || $str === 'null') return null;
        if (str_starts_with($str, "'") && str_ends_with($str, "'")) {
            $str = substr($str, 1, -1);
            $str = str_replace(["\\'", "\\\"", "\\\\", "\\n", "\\r", "\\t"], ["'", "\"", "\\", "\n", "\r", "\t"], $str);
            return $str;
        }
        return $str;
    }
}
