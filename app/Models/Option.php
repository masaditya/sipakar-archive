<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['question_id', 'text', 'score'])]
class Option extends Model
{
    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
