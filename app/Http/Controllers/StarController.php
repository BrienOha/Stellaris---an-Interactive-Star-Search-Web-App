<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DiscoveredStar;
use App\Models\StarNote;
use App\Services\StarApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StarController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $discoveredCollection = DiscoveredStar::where('user_id', $user->id)
                                ->orderBy('name')
                                ->get();

        $constellationGroups = $discoveredCollection->groupBy('constellation');
        $sidebarList = $discoveredCollection->pluck('name')->toArray();

        $favorites = $user->notes()->where('is_favorite', true)->pluck('star_name')->toArray();
        $notes = $user->notes()->get()->keyBy('star_name');

        return Inertia::render('StellarisHome', [
            'sidebarList' => $sidebarList,
            'constellationGroups' => $constellationGroups,
            'userNotes' => $notes,
            'userFavorites' => $favorites,
            'auth' => ['user' => $user],
            'searchedStar' => null,
        ]);
    }

    public function search(Request $request, StarApiService $api)
    {
        $query = $request->input('query');
        $isNewDiscovery = false;
        
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // A. CHECK LOCAL DATABASE (Using User Input)
        $localStar = DiscoveredStar::where('name', $query)->where('user_id', $user->id)->first();

        if ($localStar) {
            $raw = $localStar->toArray();
            if(!isset($raw['distance_light_year'])) $raw['distance_light_year'] = $raw['distance_ly'];
        } else {
            // B. HIT API
            $result = $api->fetchStars($query);

            if (!empty($result) && isset($result[0])) {
                $raw = $result[0];
                
                // --- FIX: CHECK DB AGAIN WITH API NAME ---
                // The API might return "Sirius A, B" even if you searched "Sirius".
                // We must check if "Sirius A, B" exists to prevent a Duplicate Entry crash.
                $existingStar = DiscoveredStar::where('user_id', $user->id)
                                              ->where('name', $raw['name'])
                                              ->first();

                if (!$existingStar) {
                    // It's truly new! Save it.
                    DiscoveredStar::create([
                        'user_id' => $user->id,
                        'name' => $raw['name'],
                        'distance_ly' => $raw['distance_light_year'],
                        'spectral_class' => $raw['spectral_class'],
                        'constellation' => $raw['constellation'] ?? 'Unknown Sector',
                        'discovered_by' => $user->name
                    ]);
                    $isNewDiscovery = true;
                } else {
                    // It existed, just under a slightly different name than the user typed.
                    // Use the existing data.
                    $raw = $existingStar->toArray();
                    if(!isset($raw['distance_light_year'])) $raw['distance_light_year'] = $raw['distance_ly'];
                }
            } else {
                return redirect()->back()->withErrors(['search' => 'TARGET_NOT_FOUND']);
            }
        }

        // C. PREPARE DATA
        $star = [
            'name' => $raw['name'],
            'distance_ly' => $raw['distance_light_year'],
            'spectral_class' => $raw['spectral_class'],
            'constellation' => $raw['constellation'] ?? 'Unknown Sector',
            'temperature' => 'Unknown', 'mass' => 'N/A', 'diameter' => 'N/A',
            'color' => $this->getStarColor($raw['spectral_class'] ?? 'G'),
            'size_visual' => 2.5
        ];

        $discoveredCollection = DiscoveredStar::where('user_id', $user->id)->orderBy('name')->get();

        return Inertia::render('StellarisHome', [
            'sidebarList' => $discoveredCollection->pluck('name')->toArray(),
            'constellationGroups' => $discoveredCollection->groupBy('constellation'),
            'userNotes' => $user->notes()->get()->keyBy('star_name'),
            'userFavorites' => $user->notes()->where('is_favorite', true)->pluck('star_name')->toArray(),
            'auth' => ['user' => $user],
            'searchedStar' => $star,
            'isNewDiscovery' => $isNewDiscovery
        ]);
    }

    public function toggleFavorite(Request $request)
    {
        $validated = $request->validate(['star_name' => 'required|string']);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $note = StarNote::firstOrNew(['user_id' => $user->id, 'star_name' => $validated['star_name']]);
        $note->is_favorite = !$note->is_favorite;
        if (!$note->story_chapter) $note->story_chapter = '';
        $note->save();

        return redirect()->back();
    }

    private function getStarColor($type) {
        $firstChar = strtoupper(substr($type ?? 'G', 0, 1));
        return match ($firstChar) {
            'O' => '#9bb0ff', 'B' => '#aabfff', 'A' => '#cad7ff', 
            'F' => '#f8f7ff', 'G' => '#fff4ea', 'K' => '#ffd2a1', 
            'M' => '#ffcc6f', default => '#ffffff'
        };
    }
    
    public function observatory() {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Observatory', ['favorites' => $user->notes()->orderBy('updated_at', 'desc')->get()]);
    }

    public function store(Request $request) {
        $validated = $request->validate([ 'star_name' => 'required|string', 'story_chapter' => 'nullable|string']);
        \App\Models\StarNote::updateOrCreate(['user_id' => Auth::id(), 'star_name' => $validated['star_name']],['story_chapter' => $validated['story_chapter'] ?? '', 'is_favorite' => true]);
        return redirect()->back();
    }

    public function destroy($star_name) {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->notes()->where('star_name', $star_name)->delete();
        return redirect()->back();
    }
}