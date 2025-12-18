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
        Schema::table('discovered_stars', function (Blueprint $table) {
            // 1. Add the User ID column (Linked to 'users' table)
            $table->foreignId('user_id')->after('id')->constrained()->cascadeOnDelete();

            // 2. Drop the global unique constraint on 'name'
            // This allows User A and User B to BOTH discover 'Sirius' independently.
            $table->dropUnique(['name']);
            
            // 3. Make the combination of User + Star Name unique
            // (So one user can't have duplicate stars, but different users can)
            $table->unique(['user_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discovered_stars', function (Blueprint $table) {
            $table->dropColumn('user_id');
            // Note: Restoring the unique index on 'name' might fail if duplicates exist,
            // but for a rollback in development, this is acceptable.
            $table->unique('name');
        });
    }
};