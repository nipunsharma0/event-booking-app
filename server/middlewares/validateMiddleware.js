
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        next();

    } catch (err) {
        const errors = err.errors.map(error => ({
            path: error.path.join('.'),
            message: error.message
        }));
        return res.status(400).json({ errors });
    }
};