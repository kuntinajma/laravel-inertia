<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CreateAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // asumsi kalau data role admin belum pernah dibuat
        $adminRole = Role::create([
            'name' => 'admin'
        ]);

        $user = User::create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123')
        ]);

        //relasi ke user & Role admin (many-to-many)
        // sync without detaching fungsinya untuk sync 2 table database many-to-many
        $user->roles()->syncWithoutDetaching($adminRole->id);
    }
}
