const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    let error = {
        success: false,
        message: 'Internal Server Error'
    };

    if (err.code === 'ER_DUP_ENTRY') {
        error.message = 'Duplicate entry found';
        error.statusCode = 409;
    } else if (err.code === 'ER_NO_SUCH_TABLE') {
        error.message = 'Database table not found';
        error.statusCode = 500;
    } else if (err.code === 'ECONNREFUSED') {
        error.message = 'Database connection refused';
        error.statusCode = 500;
    }

    if (err.name === 'ValidationError') {
        error.message = 'Validation Error';
        error.details = err.details;
        error.statusCode = 400;
    }

    if (err.type === 'entity.parse.failed') {
        error.message = 'Invalid JSON format';
        error.statusCode = 400;
    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        ...error,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
