<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'type', 'address', 'phone', 'head_name', 'description'])]
class Organization extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
