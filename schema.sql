-- database/schema.sql

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Medicines;
DROP TABLE IF EXISTS Admin;

-- Table: Admin
CREATE TABLE Admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Sample Admin User
-- IMPORTANT: In a real production environment, use hashed passwords.
INSERT INTO Admin (username, password) VALUES ('admin', 'admin123');

-- Table: Doctors
CREATE TABLE Doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    qualification TEXT NOT NULL,
    registration_no TEXT,
    timing TEXT NOT NULL,
    mobile TEXT
);

-- Sample Doctor Data
INSERT INTO Doctors (name, qualification, registration_no, timing, mobile) VALUES
('Dr. Akash Kumar Jain', 'BAMS, CSD, CCPT', '150', '6 PM – 8 PM', '9876543210'),
('Dr. Asha Kumari', 'D.G.O., DNB, Obstetrics & Gynaecology', NULL, '12 PM – 2 PM', '9876543211');

-- Table: Patients
CREATE TABLE Patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    problem_details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, mobile)
);

-- Table: Appointments
CREATE TABLE Appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT DEFAULT 'Scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients (id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors (id)
);

-- Table: Medicines
CREATE TABLE Medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    manufacturer TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL
);

-- Sample Medicine Data
INSERT INTO Medicines (name, manufacturer, stock, price) VALUES
('Paracetamol 500mg', 'Generic Pharma', 100, 25.50),
('Amoxicillin 250mg', 'MediCorp', 50, 75.00),
('Cough Syrup 100ml', 'HealthWell', 75, 120.00),
('Antacid Tablets (10s)', 'GastroCare', 200, 45.00);

