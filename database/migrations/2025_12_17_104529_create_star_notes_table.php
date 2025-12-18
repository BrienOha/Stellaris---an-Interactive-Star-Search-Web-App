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
    Schema::create('star_notes', function (Blueprint $table) {
        $table->id();
        $table->string('star_name')->index(); // Link to external API via name
        $table->text('story_chapter'); // The user's custom content
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('star_notes');
    }
};
