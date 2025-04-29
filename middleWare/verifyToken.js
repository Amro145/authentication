import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    try {
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized! No token provided.',
                user: null,
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            message: 'Unauthorized! Invalid token.',
        });
    }
}