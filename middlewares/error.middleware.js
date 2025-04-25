export const notFound = function (req, res, next) {
    res.status(404).json({ success: false, message: 'Route not found' });
};

export const errorHandler = function (err, req, res, next) {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
};
