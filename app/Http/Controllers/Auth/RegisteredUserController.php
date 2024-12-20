<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => true,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    // ini untuk menampilkan halaman edit user
    public function edit(string $id)
    {
        // ambil data user berdasarkan id
        $user = User::findOrFail($id);

        // menampilkan halaman update user
        return Inertia::render('Auth/Update');
    }

    // ini untuk update data user
    public function update(string $id, Request $request)
    {
        $user = User::findOrFail($id);

        $rules = [
            'name' => 'sometimes|nullable|string|max:255',
            'password' => ['sometimes', 'nullable', Rules\Password::defaults()],
            'is_active' => ['sometimes', 'nullable', 'boolean']
        ];

        $validator = Validator::make($request->all(), $rules);

        if($validator->fails()) {
            throw new ValidationException($validator);
        }
        // ambil data request yang VALID/lolos validasi diatas
        $validated = $validator->valid();

        // melakukan update user
        $user->update($validated);

        return redirect(route('dashboard', absolute: false));
    }
}
