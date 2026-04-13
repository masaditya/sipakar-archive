<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['period_id', 'user_id', 'question_id', 'option_id', 'status', 'notes', 'recommendation'])]
class Answer extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function option()
    {
        return $this->belongsTo(Option::class);
    }

    public function evidenceSubmissions()
    {
        return $this->hasMany(EvidenceSubmission::class);
    }
}
