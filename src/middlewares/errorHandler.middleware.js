const errorHandler = (err, req, res, next) => {
    // el status puede variar
    const { status } = err;

    return res.status(status || 500).json({
        errorName: err.name,
        message: err.message,
    });
};

module.exports = errorHandler;