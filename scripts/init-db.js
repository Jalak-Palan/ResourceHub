// Standalone Database Initialization Script for ResourceHub
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'resourcehub',
  connectionTimeoutMillis: 5000,
});

async function main() {
  console.log('🔄 Connecting to PostgreSQL (resourcehub)...');
  const client = await pool.connect();

  try {
    console.log('📦 Creating tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) DEFAULT '$2a$12$defaultPasswordHash',
        role VARCHAR(50) NOT NULL DEFAULT 'student',
        profile_image TEXT,
        department VARCHAR(255),
        student_id VARCHAR(100),
        phone VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS resources (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        specifications JSONB DEFAULT '[]'::jsonb,
        total_quantity INT NOT NULL DEFAULT 1,
        available_quantity INT NOT NULL DEFAULT 1,
        location VARCHAR(255) NOT NULL,
        rating NUMERIC(3, 2) DEFAULT 4.5,
        reviews_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(100) PRIMARY KEY,
        booking_id VARCHAR(100) UNIQUE NOT NULL,
        user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_role VARCHAR(50) DEFAULT 'student',
        resource_id VARCHAR(100) NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
        resource_name VARCHAR(255) NOT NULL,
        resource_image TEXT NOT NULL,
        resource_category VARCHAR(100) NOT NULL,
        booking_date VARCHAR(50) NOT NULL,
        start_time VARCHAR(50) NOT NULL,
        end_time VARCHAR(50) NOT NULL,
        purpose TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        issue_date VARCHAR(100),
        expected_return_date VARCHAR(100),
        actual_return_date VARCHAR(100),
        is_overdue BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'system',
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        booking_id VARCHAR(100),
        created_at VARCHAR(100),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('🌱 Seeding initial data...');
    // Seed Users
    await client.query(`
      INSERT INTO users (id, name, email, role, profile_image, department, student_id, phone)
      VALUES
      ('user-1', 'Jalak Palan', 'jalak@gmail.com', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 'Computer Engineering', 'ST-2024-8842', '+1 (555) 234-5678'),
      ('user-2', 'Prof. David Miller', 'miller@college.edu', 'staff', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 'Physics & Electronics', NULL, '+1 (555) 891-2345'),
      ('user-3', 'Dr. Sarah Connor', 'admin@resourcehub.edu', 'admin', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', 'Resource Administration', NULL, '+1 (555) 987-6543')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        role = EXCLUDED.role;
    `);

    // Seed Resources
    await client.query(`
      INSERT INTO resources (id, name, description, category, image, specifications, total_quantity, available_quantity, location, rating, reviews_count, is_active)
      VALUES
      ('res-laptop-1', 'Laptop', 'High Performance Laptop designed for heavy computation, programming, and multimedia workflows.', 'Laptops', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', '["16GB RAM", "512GB SSD", "15.6\\" Display", "Intel Core i7 13th Gen", "Backlit Keyboard"]'::jsonb, 15, 12, 'IT Lab, 2nd Floor, Room 204', 4.5, 124, TRUE),
      ('res-projector-1', 'Projector', 'Full HD Projector offering high lumen output for clear projection in well-lit auditoriums and classrooms.', 'Projectors', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800', '["4000 Lumens", "1080p Full HD", "HDMI & Wireless Display", "Built-in Speaker"]'::jsonb, 5, 3, 'Media Center, 1st Floor, Room 102', 4.8, 89, TRUE),
      ('res-camera-1', 'Camera', 'DSLR Camera equipped with optical stabilization, ideal for event photography, media projects, and interviews.', 'Cameras', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', '["24.2 MP Sensor", "4K Video Recording", "18-55mm IS STM Lens Kit", "High Speed Dual SD"]'::jsonb, 8, 5, 'Studio A, Arts & Media Block', 4.7, 62, TRUE),
      ('res-room-1', 'Meeting Room', 'Conference Room with smart conferencing board, acoustic panelling, and high-speed fiber internet.', 'Meeting Rooms', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', '["12 Seater Capacity", "65\\" 4K Smart Screen", "Polycom Video Conference", "Ergonomic Chairs"]'::jsonb, 3, 2, 'Admin Wing, 3rd Floor, Room 301', 4.9, 45, TRUE),
      ('res-lab-1', 'Digital Oscilloscope', 'Dual-channel digital storage oscilloscope for signal analysis, frequency measurement, and circuit testing.', 'Lab Equip.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800', '["100 MHz Dual Channel", "1 GSa/s Real-time Sample", "7\\" Color TFT LCD", "USB Waveform Export"]'::jsonb, 6, 4, 'Electronics Lab 3, Engineering Block', 4.6, 38, TRUE),
      ('res-lab-2', 'Compound Microscope', 'High-precision binocular biological microscope with achromat objectives and brightfield illumination.', 'Lab Equip.', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800', '["40x-1000x Magnification", "Coaxial Coarse/Fine Focus", "LED Variable Illumination"]'::jsonb, 10, 6, 'Biology Lab 1, Science Building', 4.7, 51, TRUE),
      ('res-other-1', 'Wireless Microphone Kit', 'Dual UHF wireless handheld microphone kit with receiver for presentations, lectures, and auditorium stages.', 'Others', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800', '["UHF Dual Channel", "Noise Reduction Circuit", "100m Operating Range", "Rechargeable Packs"]'::jsonb, 10, 7, 'Auditorium Control Room', 4.4, 29, TRUE)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        available_quantity = EXCLUDED.available_quantity,
        total_quantity = EXCLUDED.total_quantity;
    `);

    // Seed Bookings
    await client.query(`
      INSERT INTO bookings (id, booking_id, user_id, user_name, user_email, user_role, resource_id, resource_name, resource_image, resource_category, booking_date, start_time, end_time, purpose, status, issue_date, expected_return_date, actual_return_date, is_overdue)
      VALUES
      ('book-1', '#RH20261122001', 'user-1', 'Jalak Palan', 'jalak@gmail.com', 'student', 'res-laptop-1', 'Laptop', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800', 'Laptops', '2026-11-22', '10:00 AM', '11:00 AM', 'Project Presentation', 'approved', '20 Nov 2026', '21 Nov 2026', '21 Nov 2026', FALSE),
      ('book-2', '#RH20261125002', 'user-1', 'Jalak Palan', 'jalak@gmail.com', 'student', 'res-projector-1', 'Projector', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800', 'Projectors', '2026-11-25', '02:00 PM', '04:00 PM', 'Class Seminar', 'pending', NULL, NULL, NULL, FALSE),
      ('book-3', '#RH20261128003', 'user-1', 'Jalak Palan', 'jalak@gmail.com', 'student', 'res-camera-1', 'Camera', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', 'Cameras', '2026-11-28', '11:00 AM', '01:00 PM', 'Campus Magazine Photoshoot', 'rejected', NULL, NULL, NULL, FALSE),
      ('book-4', '#RH20261118004', 'user-2', 'Prof. David Miller', 'miller@college.edu', 'staff', 'res-projector-1', 'Projector', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800', 'Projectors', '2026-11-18', '10:00 AM', '01:00 PM', 'Physics Guest Lecture', 'completed', '18 Nov 2026', '19 Nov 2026', '19 Nov 2026', FALSE),
      ('book-5', '#RH20261116005', 'user-1', 'Jalak Palan', 'jalak@gmail.com', 'student', 'res-camera-1', 'Camera', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', 'Cameras', '2026-11-16', '02:00 PM', '05:00 PM', 'Robotics Club Exhibition', 'completed', '16 Nov 2026', '17 Nov 2026', '17 Nov 2026', FALSE),
      ('book-6', '#RH20261110006', 'user-2', 'Prof. David Miller', 'miller@college.edu', 'staff', 'res-lab-1', 'Digital Oscilloscope', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800', 'Lab Equip.', '2026-11-10', '09:00 AM', '01:00 PM', 'Embedded Systems Lab', 'approved', '10 Nov 2026', '11 Nov 2026', NULL, TRUE)
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed Notifications
    await client.query(`
      INSERT INTO notifications (id, user_id, title, message, type, is_read, booking_id, created_at)
      VALUES
      ('notif-1', 'user-1', 'Your booking is approved', 'Your booking for Laptop (#RH20261122001) on 22 Nov at 10:00 AM has been approved by admin.', 'approved', FALSE, '#RH20261122001', '22 Nov, 09:30 AM'),
      ('notif-2', 'user-1', 'Maintenance scheduled', 'Lab equipment in Electronics Lab 3 will be unavailable on 24 Nov from 02:00 PM to 06:00 PM for routine maintenance.', 'reminder', FALSE, NULL, '21 Nov, 06:00 PM'),
      ('notif-3', 'user-1', 'New resource added', 'Sony Alpha 4K Video camera kit is now available in Studio A for academic reservation.', 'system', TRUE, NULL, '20 Nov, 02:15 PM'),
      ('notif-4', 'user-1', 'Your booking is rejected', 'Your request for Camera on 28 Nov (#RH20261128003) was declined due to departmental reservation.', 'rejected', TRUE, '#RH20261128003', '19 Nov, 01:20 PM'),
      ('notif-5', 'user-3', 'New booking request', 'Jalak Palan requested Full HD Projector for 25 Nov 02:00 PM. Needs review.', 'new_request', FALSE, '#RH20261125002', '21 Nov, 08:15 AM')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✅ PostgreSQL resourcehub database initialized and seeded successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('❌ Database initialization error:', err);
  process.exit(1);
});
