<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['answer_id', 'file_path', 'original_name'])]
class EvidenceSubmission extends Model
{
    public function answer()
    {
        return $this->belongsTo(Answer::class);
    }
}
