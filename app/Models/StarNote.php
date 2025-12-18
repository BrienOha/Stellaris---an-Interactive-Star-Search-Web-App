<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StarNote extends Model
{
    protected $fillable = ['user_id', 'star_name', 'story_chapter', 'is_favorite'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}