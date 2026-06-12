<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['question_id', 'text', 'score', 'excludes_from_scoring'])]
class Option extends Model
{
    protected $casts = [
        'excludes_from_scoring' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
