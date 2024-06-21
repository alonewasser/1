import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const prisma = new PrismaClient();


export const create = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace(/Bearer\s*/, '');

        if (!token) {
            return res.status(401).json({ message: 'Токен отсутствует' });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, 'secret123');
        } catch (error) {
            console.error('Ошибка при декодировании токена:', error);
            return res.status(403).json({ message: 'Неверный токен или у вас нет доступа' });
        }

        const isAdmin = decoded.isAdmin === true;
        const { title, description, userId, timer } = req.body;
        const parsedUserId = parseInt(userId, 10);

        if (isNaN(parsedUserId)) {
            return res.status(400).json({ message: 'Некорректное значение для userId' });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                userId: parsedUserId, 
                timer,
            },
        });

        res.json(newTask);
    } catch (error) {
        console.error('Ошибка при создании задачи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


export const getMe = async (req, res) => {
    try {
        const userId = parseInt(req.body.userId, 10); 
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Некорректное значение userId' });
        }
        const tasks = await prisma.task.findMany({
            where: {
                userId: userId,
            },
        });

        res.json(tasks);
    } catch (error) {
        console.error('Ошибка при получении задач пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


export const remove = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'Некорректное значение taskId' });
        }

        const deletedTask = await prisma.task.delete({
            where: {
                id: taskId,
            },
        });

        res.json({ message: 'Задача успешно удалена', task: deletedTask });
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const updateDescription = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        const { description } = req.body;

        if (isNaN(taskId)) {
            return res.status(400).json({ message: 'некорректное значение taskId' });
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                description: description,
            },
        });

        res.json({ message: 'Описание задачи успешно обновлено', task: updatedTask });
    } catch (error) {
        console.error('Ошибка при обновлении описания задачи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};