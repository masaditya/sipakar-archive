<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('aspects', function (Blueprint $table) {
            $table->string('type')->nullable()->after('name');
        });

        DB::table('aspects')->where('name', 'like', '[UK]%')->update(['type' => 'Unit Kearsipan']);
        DB::table('aspects')->where('name', 'like', '[UP]%')->update(['type' => 'Unit Pengolah']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aspects', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
