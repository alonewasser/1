import jwt from 'jsonwebtoken';



const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Токен отсутствует',
        });
    }

    const token = authHeader.replace(/Bearer\s+/i, '');

    try {
        const decoded = jwt.verify(token, 'secret123');
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

       
        req.userId = decoded.userId;
        req.isAdmin = user.isAdmin || false; 
        next();
    } catch (e) {
        console.error('Ошибка при декодировании токена или доступе к базе данных:', e);
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
};

export default checkAuth;