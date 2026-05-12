import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/connection';
import logger from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'USER',
      },
    });

    logger.info(`Novo usuário registrado: ${email}`);

    res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error: any) {
    logger.error(`Erro no registro de usuário: ${error.message}`);
    res.status(500).json({ message: 'Erro interno ao criar usuário.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '24h' }
    );

    logger.info(`Usuário logado: ${email}`);

    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    logger.error(`Erro no login de usuário: ${error.message}`);
    res.status(500).json({ message: 'Erro interno ao realizar login.' });
  }
};
