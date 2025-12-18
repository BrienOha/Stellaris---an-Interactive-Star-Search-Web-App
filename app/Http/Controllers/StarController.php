<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DiscoveredStar; 
use App\Services\StarApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StarController extends Controller
{
    public function index()
    {
        // 1. Sidebar source: Only show stars discovered by THIS user
        $discovered = DiscoveredStar::where('user_id', Auth::id())
                        ->orderBy('name')
                        ->pluck('name')
                        ->toArray();
        
        // If empty (fresh install), provide a few starters
        if (empty($discovered)) {
            $discovered = ['Sirius', 'Vega']; 
        }

        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $notes = $user ? $user->notes()->get()->keyBy('star_name') : [];

        return Inertia::render('StellarisHome', [
            'sidebarList' => $discovered,
            'userNotes' => $notes,
            'auth' => ['user' => $user],
            'searchedStar' => null,
            'flash' => session('flash') // For passing "New Discovery" flags
        ]);
    }

    public function search(Request $request, StarApiService $api)
    {
        $query = $request->input('query');
        $isNewDiscovery = false;

        // A. CHECK LOCAL DATABASE (Scoped to User)
        $localStar = DiscoveredStar::where('name', $query)
                        ->where('user_id', Auth::id()) // <--- Only check MY stars
                        ->first();

        if ($localStar) {
            $raw = $localStar->toArray(); // Use local data
        } else {
            // B. NOT FOUND LOCALLY? HIT THE API.
            $result = $api->fetchStars($query);

            if (!empty($result) && isset($result[0])) {
                $raw = $result[0];
                
                // SAVE TO POXEDEX (Linked to this specific user)
                DiscoveredStar::create([
                    'user_id' => Auth::id(), // <--- Assign owner
                    'name' => $raw['name'],
                    'distance_ly' => $raw['distance_light_year'],
                    'spectral_class' => $raw['spectral_class'],
                    'constellation' => $raw['constellation'],
                    'discovered_by' => Auth::user() ? Auth::user()->name : 'Anonymous'
                ]);
                
                $isNewDiscovery = true; // Trigger the animation
            } else {
                // Not found in API either
                return redirect()->back()->withErrors(['search' => 'TARGET_NOT_FOUND']);
            }
        }

        // C. PREPARE DATA FOR FRONTEND
        $star = [
            'name' => $raw['name'],
            'distance_ly' => $raw['distance_light_year'] ?? $raw['distance_ly'],
            'spectral_class' => $raw['spectral_class'],
            'constellation' => $raw['constellation'],
            'temperature' => 'Unknown',
            'mass' => 'N/A',
            'diameter' => 'N/A',
            'color' => $this->getStarColor($raw['spectral_class'] ?? 'G'),
            'size_visual' => 2.5
        ];

        // Refresh list (Scoped to User)
        $sidebarList = DiscoveredStar::where('user_id', Auth::id())
                        ->orderBy('name')
                        ->pluck('name')
                        ->toArray();
        
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        $notes = $user ? $user->notes()->get()->keyBy('star_name') : [];

        return Inertia::render('StellarisHome', [
            'sidebarList' => $sidebarList,
            'userNotes' => $notes,
            'auth' => ['user' => $user],
            'searchedStar' => $star,
            'isNewDiscovery' => $isNewDiscovery // Pass this flag to React
        ]);
    }

    private function getStarColor($type) {
        $firstChar = strtoupper(substr($type ?? 'G', 0, 1));
        return match ($firstChar) {
            'O' => '#9bb0ff', 'B' => '#aabfff', 'A' => '#cad7ff', 
            'F' => '#f8f7ff', 'G' => '#fff4ea', 'K' => '#ffd2a1', 
            'M' => '#ffcc6f', default => '#ffffff'
        };
    }
    
    // ... Keep observatory, store, destroy ...
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