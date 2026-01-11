// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- Database Setup ---
const dbPath = path.join(__dirname, 'database', 'database.db');
const schemaPath = path.join(__dirname, 'database', 'schema.sql');

function initializeDatabase() {
    const dbExists = fs.existsSync(dbPath);
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            return;
        }
        console.log('Connected to the SQLite database.');
    });

    if (!dbExists) {
        console.log('Database not found. Initializing from schema...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schemaSql, (err) => {
            if (err) {
                console.error('Error initializing database:', err.message);
            } else {
                console.log('Database initialized successfully.');
            }
        });
    }
    return db;
}

const db = initializeDatabase();

// --- API Endpoints ---

// GET: Fetch all doctors
app.get('/api/doctors', (req, res) => {
    db.all("SELECT id, name, qualification, timing FROM Doctors", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ doctors: rows });
    });
});

// POST: Patient Registration
app.post('/api/patients/register', (req, res) => {
    const { name, age, gender, mobile, address, problem_details } = req.body;

    // Validation
    if (!name || !age || !gender || !mobile) {
        return res.status(400).json({ error: 'Name, Age, Gender, and Mobile are required.' });
    }

    // Check for duplicate patient (name + mobile)
    const checkSql = "SELECT id FROM Patients WHERE name = ? AND mobile = ?";
    db.get(checkSql, [name, mobile], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            return res.status(409).json({ status: 'duplicate', message: 'Patient with this name and mobile number already exists.' });
        }

        // Insert new patient
        const insertSql = "INSERT INTO Patients (name, age, gender, mobile, address, problem_details) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(insertSql, [name, age, gender, mobile, address, problem_details], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ status: 'success', message: 'Patient registered successfully.', patientId: this.lastID });
        });
    });
});

// POST: Doctor Registration (Admin)
app.post('/api/doctors/register', (req, res) => {
    const { name, qualification, registration_no, timing, mobile } = req.body;
    if (!name || !qualification || !timing) {
        return res.status(400).json({ error: 'Name, Qualification, and Timing are required.' });
    }
    const sql = "INSERT INTO Doctors (name, qualification, registration_no, timing, mobile) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [name, qualification, registration_no, timing, mobile], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ status: 'success', message: 'Doctor registered successfully.', doctorId: this.lastID });
    });
});

// POST: Book Appointment
app.post('/api/appointments/book', (req, res) => {
    const { patient_mobile, doctor_id, appointment_date } = req.body;

    if (!patient_mobile || !doctor_id || !appointment_date) {
        return res.status(400).json({ error: 'Patient mobile, Doctor, and Appointment Date are required.' });
    }

    // Find patient by mobile number first
    const patientSql = "SELECT id FROM Patients WHERE mobile = ?";
    db.get(patientSql, [patient_mobile], (err, patient) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found with this mobile number. Please register first.' });
        }

        const patient_id = patient.id;

        // Get doctor's timing
        db.get("SELECT timing FROM Doctors WHERE id = ?", [doctor_id], (err, doctor) => {
            if (err || !doctor) {
                return res.status(500).json({ error: 'Could not find doctor timing.' });
            }

            const sql = "INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)";
            db.run(sql, [patient_id, doctor_id, appointment_date, doctor.timing], function(err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ 
                    status: 'success', 
                    message: 'Appointment booked successfully.', 
                    appointmentId: this.lastID,
                    doctorTiming: doctor.timing 
                });
            });
        });
    });
});

// POST: Admin Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    const sql = "SELECT * FROM Admin WHERE username = ? AND password = ?";
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ status: 'success', message: 'Login successful.' });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
        }
    });
});

// --- Medicine CRUD API ---

// GET: All medicines
app.get('/api/medicines', (req, res) => {
    db.all("SELECT * FROM Medicines ORDER BY name", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ medicines: rows });
    });
});

// POST: Add a new medicine
app.post('/api/medicines', (req, res) => {
    const { name, manufacturer, stock, price } = req.body;
    if (!name || stock === undefined || price === undefined) {
        return res.status(400).json({ error: 'Name, stock, and price are required.' });
    }
    const sql = "INSERT INTO Medicines (name, manufacturer, stock, price) VALUES (?, ?, ?, ?)";
    db.run(sql, [name, manufacturer, stock, price], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ status: 'success', message: 'Medicine added.', medicineId: this.lastID });
    });
});

// PUT: Update a medicine
app.put('/api/medicines/:id', (req, res) => {
    const { id } = req.params;
    const { name, manufacturer, stock, price } = req.body;
    if (!name || stock === undefined || price === undefined) {
        return res.status(400).json({ error: 'Name, stock, and price are required.' });
    }
    const sql = "UPDATE Medicines SET name = ?, manufacturer = ?, stock = ?, price = ? WHERE id = ?";
    db.run(sql, [name, manufacturer, stock, price, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Medicine not found.' });
        }
        res.json({ status: 'success', message: 'Medicine updated.' });
    });
});

// DELETE: A medicine
app.delete('/api/medicines/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Medicines WHERE id = ?";
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Medicine not found.' });
        }
        res.json({ status: 'success', message: 'Medicine deleted.' });
    });
});


// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
