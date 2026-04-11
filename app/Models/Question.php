<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['sub_aspect_id', 'text', 'instructions', 'legal_basis', 'helper', 'example_file_paths'])]
class Question extends Model
{
    protected $casts = [
        'example_file_paths' => 'array',
    ];
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
