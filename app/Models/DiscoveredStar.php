<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscoveredStar extends Model
{
    protected $fillable = [
        'user_id', // <--- ADDED
        'name', 
        'distance_ly', 
        'spectral_class', 
        'constellation', 
        'discovered_by'
    ];
}