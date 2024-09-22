<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chirp extends Model
{
    use HasFactory;
    //to enable mass-assignment protection to prevent users editing any column they want
    protected $fillable = [
        'message',
    ];


    //define user relationship model, also the inverse of hasmany relationship added on User.php
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
