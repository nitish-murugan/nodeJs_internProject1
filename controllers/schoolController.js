const School = require('../models/School');
const { addSchoolValidation, listSchoolsValidation } = require('../validators/schoolValidator');

class SchoolController {
    async addSchool(req, res) {
        try {
            const { error, value } = addSchoolValidation.validate(req.body);
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const result = await School.addSchool(value);

            res.status(201).json({
                success: true,
                message: 'School added successfully',
                data: result
            });

        } catch (error) {
            console.error('Error in addSchool controller:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }

    async listSchools(req, res) {
        try {
            const queryData = {
                latitude: parseFloat(req.query.latitude),
                longitude: parseFloat(req.query.longitude)
            };

            const { error, value } = listSchoolsValidation.validate(queryData);
            
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const schools = await School.getSchoolsSortedByProximity(
                value.latitude, 
                value.longitude
            );

            res.status(200).json({
                success: true,
                message: 'Schools retrieved successfully',
                userLocation: {
                    latitude: value.latitude,
                    longitude: value.longitude
                },
                count: schools.length,
                data: schools
            });

        } catch (error) {
            console.error('Error in listSchools controller:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }

    async getAllSchools(req, res) {
        try {
            const schools = await School.getAllSchools();

            res.status(200).json({
                success: true,
                message: 'All schools retrieved successfully',
                count: schools.length,
                data: schools
            });

        } catch (error) {
            console.error('Error in getAllSchools controller:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }

    async getSchoolById(req, res) {
        try {
            const schoolId = parseInt(req.params.id);
            
            if (isNaN(schoolId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid school ID'
                });
            }

            const school = await School.getSchoolById(schoolId);

            if (!school) {
                return res.status(404).json({
                    success: false,
                    message: 'School not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'School retrieved successfully',
                data: school
            });

        } catch (error) {
            console.error('Error in getSchoolById controller:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }
}

module.exports = new SchoolController();
