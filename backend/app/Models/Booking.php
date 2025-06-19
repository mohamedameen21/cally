<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_user_id',
        'guest_user_id',
        'booking_time',
        'notes',
        'meeting_link',
    ];


    protected function casts(): array
    {
        return [
            'booking_time' => 'datetime',
        ];
    }

    public function getEndTimeAttribute(): Carbon
    {
        return $this->booking_time->copy()->addMinutes(30);
    }

   
    public function getBookingDateAttribute(): string
    {
        return $this->booking_time->format('Y-m-d');
    }

    public function getStartTimeAttribute(): string
    {
        return $this->booking_time->format('H:i:s');
    }

    public function hostUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    public function guestUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_user_id');
    }

    public function scopeForDateRange($query, $startDate, $endDate)
    {
        $startDateTime = Carbon::parse($startDate)->startOfDay();
        $endDateTime = Carbon::parse($endDate)->endOfDay();
        
        return $query->whereBetween('booking_time', [$startDateTime, $endDateTime]);
    }

}
