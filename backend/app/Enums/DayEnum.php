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

    /**
     * Get the human-readable label for the enum value.
     *
     * @return string
     */
    public function getLabel(): string
    {
        return ucfirst($this->value);
    }

    /**
     * Check if a value is valid.
     *
     * @param string $value
     * @return bool
     */
    public static function isValid(string $value): bool
    {
        return in_array($value, self::getValues());
    }
}
