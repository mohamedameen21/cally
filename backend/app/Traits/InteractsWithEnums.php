<?php

namespace App\Traits;

trait InteractsWithEnums
{
    public static function getOptionsWithKeyValuePair($specificOptions = []): array
    {
        return collect(self::cases())
            ->filter(fn ($type) => empty($specificOptions) || in_array($type->value, $specificOptions))
            ->mapWithKeys(fn ($type) => [
                $type->value => $type->getLabel(),
            ])->toArray();
    }

    public static function getValues(array $exclude = [])
    {
        return collect(self::cases())
            ->map(fn ($type) => $type->value)
            ->reject(fn ($value) => in_array($value, $exclude))
            ->values()
            ->toArray();
    }

    public static function keyValue(): array
    {
        return collect(self::cases())->mapWithKeys(function ($case) {
            return [$case->name => $case->value];
        })->toArray();
    }
}