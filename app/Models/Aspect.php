<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'description', 'score_weight', 'period_id', 'type'])]
class Aspect extends Model
{
    public function subAspects()
    {
        return $this->hasMany(SubAspect::class);
    }
}
