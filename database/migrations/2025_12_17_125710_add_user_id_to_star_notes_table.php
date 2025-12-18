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
        Schema::table('star_notes', function (Blueprint $table) {
            // Add a column that links to the 'users' table
            $table->foreignId('user_id')->after('id')->constrained()->cascadeOnDelete();
            
            // OPTIONAL: Add a boolean for simple favoriting if they don't write a note
            $table->boolean('is_favorite')->default(true);
        });
    }

    public function down(): void
    {
        Schema::table('star_notes', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'is_favorite']);
        });
    }
};
