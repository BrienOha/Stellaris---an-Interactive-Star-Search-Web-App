# Stellaris 🌌

**Stellaris** is a web-based space exploration application that allows users to discover stars, view them in a 3D interactive environment, and catalogue their findings in a personal "Pokedex."

Built with **Laravel (Backend)**, **Inertia.js + React (Frontend)**, and **Three.js (3D Visualization)**.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
* **PHP** (v8.1 or higher)
* **Composer** (PHP Dependency Manager)
* **Node.js** & **npm** (JavaScript Runtime)
* **PostgreSQL** (Database)

---

## ⚙️ Installation Guide

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/BrienOha/Stellaris---an-Interactive-Star-Search-Web-App](https://github.com/BrienOha/Stellaris---an-Interactive-Star-Search-Web-App)
cd Stellaris

# 2. Install Dependencies
composer install
npm install

# 3. Create a .env file  (Make sure you copy this here for the env) NOTE : THERE IS AN .envexample FILE IN THE REPO THAT YOU SHOULD FOLLOW THAT FORMAT 
# This here is just added, just find the one inside .envexample, copy all the contents and make an actual .env file
# Then add this vvv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=stellaris_db
DB_USERNAME=postgres
DB_PASSWORD=your_password_here

# Also add this at the end of the .env file 
STARS_API_KEY=your_api_ninjas_key_here

# 4. This command generates the encryption key used by Laravel:
php artisan key:generate

# DB SET-UP 
# Once your .env is configured and your PostgreSQL service is running:
# Create the Database: Make sure a database named stellaris_db

#Run Migrations: This command will create all necessary tables (users, discovered_stars, star_notes) in your database.
php artisan migrate

# 5. Running the App 
php artisan serve # Backend
npm run dev # Frontend

# Just open 2 terminals for it to work