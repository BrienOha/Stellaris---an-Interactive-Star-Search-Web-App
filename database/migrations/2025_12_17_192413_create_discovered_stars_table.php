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
        Schema::create('discovered_stars', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('distance_ly')->nullable();
            $table->string('spectral_class')->nullable();
            $table->string('constellation')->nullable();
            $table->string('discovered_by')->nullable(); // Stores name of user who found it
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discovered_stars');
    }
};
