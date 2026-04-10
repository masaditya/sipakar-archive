<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'is_active'])]
class Period extends Model
{
    public function aspects()
    {
        return $this->hasMany(Aspect::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
