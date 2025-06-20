<?php

namespace App\Models;

use App\Enums\DayEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
    ];


    protected function casts(): array
    {
        return [
            'day_of_week' => DayEnum::class,
            'is_available' => 'boolean',
        ];
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
