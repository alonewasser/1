import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { email, fullName, password, avatarUrl } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже зарегистрирован' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        password: passwordHash,
        avatarUrl,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        isAdmin: false, 
      },
      'secret123',
      { expiresIn: '30d' }
    );

    res.json({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      token,
    });
  } catch (err) {
    console.error('Ошибка при регистрации пользователя', err);
    res.status(500).json({ message: 'Не удалось зарегистрировать пользователя' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Такого пользователя нет' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Проверьте логин или пароль' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin, 
      },
      'secret123',
      { expiresIn: '30d' }
    );

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      token,
    });
  } catch (err) {
    console.error('Ошибка при входе в систему', err);
    res.status(500).json({ message: 'Не удалось войти в систему' });
  }
};
