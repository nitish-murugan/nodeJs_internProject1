CREATE DATABASE IF NOT EXISTS school_management;

USE school_management;

CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (latitude, longitude),
    INDEX idx_name (name)
);

INSERT INTO schools (name, address, latitude, longitude) VALUES
('Delhi Public School', 'Sector 24, Rohini, New Delhi, Delhi 110085', 28.7041, 77.1025),
('Ryan International School', 'Sector 25, Rohini, New Delhi, Delhi 110085', 28.7051, 77.1035),
('St. Mary\'s School', 'R K Puram, New Delhi, Delhi 110022', 28.5706, 77.1807),
('Modern School', 'Barakhamba Road, New Delhi, Delhi 110001', 28.6250, 77.2197),
('Sardar Patel Vidyalaya', 'Lodhi Estate, New Delhi, Delhi 110003', 28.5933, 77.2507),
('The Heritage School', 'Vasant Vihar, New Delhi, Delhi 110057', 28.5506, 77.1601),
('Bluebells School International', 'Kailash Colony, New Delhi, Delhi 110048', 28.5355, 77.2425),
('Mount Abu Public School', 'Rohini, New Delhi, Delhi 110085', 28.7041, 77.1125);

SELECT * FROM schools;
