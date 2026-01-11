# Loknath Medical - Full Stack Website

This is a complete full-stack website for a medical store with an attached doctor clinic, built as per the project requirements.

## Branding
- **Store/Clinic Name:** Loknath Medical
- **Primary Theme Colors:** Light Sea-Green + White
- **Discount Banner:** “Up to 15% OFF on All Medicines”

## Technology Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js / Express.js
- **Database:** SQLite

## Features
- **Public Pages:** Home, About, Doctors List.
- **Patient Services:** Patient Registration with duplicate checking, Appointment Booking.
- **Admin Panel:** Secure login for administrators.
- **CRUD Operations:** Full Create, Read, Update, and Delete functionality for Medicines.
- **Doctor Management:** Admins can add new doctors to the system.
- **Dynamic Content:** Asynchronous form submissions (AJAX/Fetch) and dynamic data loading.

---

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (which includes npm)

---

## How to Run the Project

1.  **Clone the Repository (or Unzip the Project Folder)**
    Navigate to the directory where you want to store the project.

2.  **Navigate to the Project Directory**
    Open your terminal or command prompt and change to the project's root folder.
    ```bash
    cd loknath-medical
    ```

3.  **Install Dependencies**
    Run the following command to install all the required backend packages listed in `package.json`.
    ```bash
    npm install
    ```

4.  **Initialize & Seed the Database**
    The server is configured to automatically create and initialize the database (`database/database.db`) from the `database/schema.sql` script the first time it starts. This script creates all necessary tables and inserts the sample data for doctors and medicines.

5.  **Start the Server**
    You can run the server in two modes:

    -   **Production Mode:**
        ```bash
        npm start
        ```

    -   **Development Mode (Recommended):**
        This uses `nodemon` to automatically restart the server whenever you make changes to the source code.
        ```bash
        npm run dev
        ```

6.  **Access the Website**
    Once the server is running, you will see a confirmation message in your terminal:
    ```
    Server is running on http://localhost:3000
    Connected to the SQLite database.
    ```
    Open your web browser and navigate to:
    [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
loknath-medical/
├── database/
│   ├── database.db      -- The SQLite database file (auto-generated)
│   └── schema.sql       -- SQL script for table creation and seeding
├── node_modules/        -- Installed npm packages
├── public/
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── doctor-registration.html
│   │   ├── index.html   -- Admin login page
│   │   └── medicines.html
│   ├── css/
│   │   └── style.css    -- Main stylesheet
│   ├── js/
│   │   ├── admin.js     -- Logic for all admin pages
│   │   ├── appointment.js
│   │   └── patient.js
│   ├── about.html
│   ├── appointment.html
│   ├── doctors.html
│   ├── index.html       -- Home page
│   └── patient-registration.html
├── .gitignore           -- (Optional) To ignore node_modules
├── package-lock.json
├── package.json
├── README.md            -- This file
└── server.js            -- The main Express.js backend server
```

## Admin Access
-   **URL:** `http://localhost:3000/admin/`
-   **Username:** `admin`
-   **Password:** `admin123`

These credentials are saved in plain text in the `database/schema.sql` file. For a real-world application, always hash and salt passwords.
