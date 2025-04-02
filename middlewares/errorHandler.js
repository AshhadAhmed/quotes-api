export const notFound = function (req, res, next) {
    res.status(404).json({ success: false, message: 'Unknown route' });
};