<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['sub_aspect_id', 'text', 'instructions', 'legal_basis', 'example_file_path'])]
class Question extends Model
{
    public function subAspect()
    {
        return $this->belongsTo(SubAspect::class);
    }

    public function options()
    {
        return $this->hasMany(Option::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
