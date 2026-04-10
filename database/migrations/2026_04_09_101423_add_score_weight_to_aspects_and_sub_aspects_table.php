<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('aspects', function (Blueprint $table) {
            $table->integer('score_weight')->nullable()->after('description');
        });

        Schema::table('sub_aspects', function (Blueprint $table) {
            $table->integer('score_weight')->nullable()->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sub_aspects', function (Blueprint $table) {
            $table->dropColumn('score_weight');
        });

        Schema::table('aspects', function (Blueprint $table) {
            $table->dropColumn('score_weight');
        });
    }
};
