import { Request, Response } from 'express';
import prisma from '../database/connection';
import logger from '../utils/logger';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const alerts = await prisma.scheduledSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(alerts);
  } catch (error: any) {
    logger.error(`Error fetching alerts: ${error.message}`);
    res.status(500).json({ error: 'Erro ao buscar alertas' });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { query, frequency } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Termo de busca é obrigatório' });
    }

    // Map frequency to cron expression (simplified)
    let cronExpression = '0 * * * *'; // Default: hourly
    if (frequency === 'daily') cronExpression = '0 0 * * *';
    
    const alert = await prisma.scheduledSearch.create({
      data: {
        userId,
        query,
        cronExpression,
        isActive: true,
        nextRunAt: new Date() // Run immediately or on next cycle
      }
    });

    res.status(201).json(alert);
  } catch (error: any) {
    logger.error(`Error creating alert: ${error.message}`);
    res.status(500).json({ error: 'Erro ao criar alerta' });
  }
};

export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const { isActive, frequency, query } = req.body;

    const existingAlert = await prisma.scheduledSearch.findFirst({
      where: { id: Number(id), userId }
    });

    if (!existingAlert) {
      return res.status(404).json({ error: 'Alerta não encontrado' });
    }

    let cronExpression = existingAlert.cronExpression;
    if (frequency === 'daily') cronExpression = '0 0 * * *';
    if (frequency === 'hourly') cronExpression = '0 * * * *';

    const updatedAlert = await prisma.scheduledSearch.update({
      where: { id: Number(id) },
      data: {
        isActive: isActive !== undefined ? isActive : existingAlert.isActive,
        query: query || existingAlert.query,
        cronExpression
      }
    });

    res.json(updatedAlert);
  } catch (error: any) {
    logger.error(`Error updating alert: ${error.message}`);
    res.status(500).json({ error: 'Erro ao atualizar alerta' });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    await prisma.scheduledSearch.deleteMany({
      where: { id: Number(id), userId }
    });

    res.json({ message: 'Alerta removido com sucesso' });
  } catch (error: any) {
    logger.error(`Error deleting alert: ${error.message}`);
    res.status(500).json({ error: 'Erro ao remover alerta' });
  }
};
