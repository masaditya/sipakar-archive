<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->string('scoring_mode', 20)->default('required')->after('helper');
        });

        Schema::table('options', function (Blueprint $table) {
            $table->boolean('excludes_from_scoring')->default(false)->after('score');
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('scoring_mode');
        });

        Schema::table('options', function (Blueprint $table) {
            $table->dropColumn('excludes_from_scoring');
        });
    }
};
