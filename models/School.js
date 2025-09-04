const database = require('../config/database');

class School {
    constructor() {
        this.tableName = 'schools';
    }

    async addSchool(schoolData) {
        try {
            const { name, address, latitude, longitude } = schoolData;
            
            const query = `
                INSERT INTO ${this.tableName} (name, address, latitude, longitude) 
                VALUES (?, ?, ?, ?)
            `;
            
            const result = await database.run(query, [name, address, latitude, longitude]);
            
            return {
                id: result.id,
                name,
                address,
                latitude,
                longitude,
                message: 'School added successfully'
            };
        } catch (error) {
            console.error('Error adding school:', error.message);
            throw error;
        }
    }

    async getAllSchools() {
        try {
            const query = `SELECT * FROM ${this.tableName}`;
            const rows = await database.all(query);
            return rows;
        } catch (error) {
            console.error('Error fetching schools:', error.message);
            throw error;
        }
    }

    async getSchoolById(id) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            const row = await database.get(query, [id]);
            return row || null;
        } catch (error) {
            console.error('Error fetching school by ID:', error.message);
            throw error;
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    async getSchoolsSortedByProximity(userLat, userLon) {
        try {
            const schools = await this.getAllSchools();
            
            const schoolsWithDistance = schools.map(school => ({
                ...school,
                distance: this.calculateDistance(
                    userLat, 
                    userLon, 
                    school.latitude, 
                    school.longitude
                )
            }));

            schoolsWithDistance.sort((a, b) => a.distance - b.distance);

            return schoolsWithDistance;
        } catch (error) {
            console.error('Error getting schools sorted by proximity:', error.message);
            throw error;
        }
    }
}

module.exports = new School();
