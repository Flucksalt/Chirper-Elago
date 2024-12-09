<?php

namespace App\Http\Controllers;

use App\Models\Mayor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MayorController extends Controller
{
    public function index()
    {
        $mayors = Mayor::all();
        return Inertia::render('Mayors/Index', ['mayors' => $mayors]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);

        Mayor::create($request->all());

        return redirect()->route('mayors.index');
    }

    public function update(Request $request, Mayor $mayor)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
        ]);

        $mayor->update($request->all());

        return redirect()->route('mayors.index');
    }

    public function destroy(Mayor $mayor)
    {
        $mayor->delete();

        return redirect()->route('mayors.index');
    }
}
