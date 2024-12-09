<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::all();
        return Inertia::render('Games/Index', ['games' => $games]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'studio' => 'required|string|max:255',
            'genre' => 'required|string|max:255',
            'review' => 'required|in:positive,negative',
        ]);

        Game::create($request->all());

        return redirect()->route('games.index');
    }

    public function update(Request $request, Game $game)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'studio' => 'required|string|max:255',
            'genre' => 'required|string|max:255',
            'review' => 'required|in:positive,negative',
        ]);

        $game->update($request->all());

        return redirect()->route('games.index');
    }

    public function destroy(Game $game)
    {
        $game->delete();

        return redirect()->route('games.index');
    }
}