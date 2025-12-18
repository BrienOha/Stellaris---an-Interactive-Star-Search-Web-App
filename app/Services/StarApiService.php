<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\Response;

class StarApiService
{
    public function fetchStars($query = null): array
    {
        try {
            $params = [];

            if (is_string($query)) {
                $params['name'] = $query;
            } elseif (is_array($query)) {
                $params = $query;
            } else {
                // Default fallback
                $params['max_magnitude'] = 4;
            }

            // FORCE LIMIT: API-Ninjas usually allows up to 30-50 per call. 
            // We request 100, but the API might cap it at its internal max.
            if (!isset($params['limit'])) {
                $params['limit'] = 100; 
            }

            /** @var Response $response */
            $response = Http::withHeaders([
                'X-Api-Key' => env('STARS_API_KEY')
            ])->timeout(10)->get('https://api.api-ninjas.com/v1/stars', $params);

            if ($response->successful()) {
                return $response->json();
            }
            
            Log::error('API Error: ' . $response->body());
            return [];
        } catch (\Exception $e) {
            Log::error('Connection Error: ' . $e->getMessage());
            return [];
        }
    }
}