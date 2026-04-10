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
        Schema::create('periods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., 2025, 2026
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        Schema::table('aspects', function (Blueprint $table) {
            $table->foreignId('period_id')->nullable()->after('id')->constrained('periods')->onDelete('cascade');
        });

        Schema::table('answers', function (Blueprint $table) {
            $table->foreignId('period_id')->nullable()->after('id')->constrained('periods')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('answers', function (Blueprint $table) {
            $table->dropForeign(['period_id']);
            $table->dropColumn('period_id');
        });

        Schema::table('aspects', function (Blueprint $table) {
            $table->dropForeign(['period_id']);
            $table->dropColumn('period_id');
        });

        Schema::dropIfExists('periods');
    }
};
