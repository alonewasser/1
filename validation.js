import { body } from 'express-validator';

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min:5 }),
    body('fullName').isLength({ min:2 })
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(), 
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 8}), 

];

export const taskCreateValidation = [
    body('title').isLength({ min: 3 }).withMessage('Введите заголовок задачи').isString(),
    body('description').isLength({ min: 10 }).withMessage('Введите описание задачи').isString(),
    body('timer').custom((value, { req }) => {
        const { createdAt } = req;
    
        if (!value) {
          return true;
        }
        const timerDate = new Date(value);
        const timeUntilTimer = timerDate - new Date();
    
        setTimeout(() => {
          if (req.taskExists && req.taskStatus !== 1) { 
            req.taskStatus = 3;
          }
        }, timeUntilTimer);
    
        return true;
      }),
    ];

    export const validateRemoveTask = [
        body('id').isInt().toInt(),
    ];