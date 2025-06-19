<?php

namespace App\Enums;

use App\Traits\InteractsWithEnums;

enum DayEnum: string
{
    use InteractsWithEnums;

    case MONDAY = 'monday';
    case TUESDAY = 'tuesday';
    case WEDNESDAY = 'wednesday';
    case THURSDAY = 'thursday';
    case FRIDAY = 'friday';
    case SATURDAY = 'saturday';
    case SUNDAY = 'sunday';

    
    public function getLabel(): string
    {
        return ucfirst($this->value);
    }


    public static function isValid(string $value): bool
    {
        return in_array($value, self::getValues());
    }
}
