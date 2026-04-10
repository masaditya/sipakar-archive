<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['aspect_id', 'name', 'type', 'score_weight'])]
class SubAspect extends Model
{
    public function aspect()
    {
        return $this->belongsTo(Aspect::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
