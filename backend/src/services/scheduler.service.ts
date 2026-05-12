import cron from 'node-cron';
import prisma from '../database/connection';
import logger from '../utils/logger';
import { getLongLivedToken } from './instagram.service';
import { processSearchInternal } from './search.service';

/**
 * Initialize all scheduled jobs
 */
export const initScheduler = () => {
  // 1. Token Renewal Job: Runs every day at midnight
  cron.schedule('0 0 * * *', async () => {
    logger.info('Iniciando tarefa de renovação de tokens do Instagram...');
    await renewTokens();
  });

  // 2. Scheduled Searches Job: Runs every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Iniciando verificação de pesquisas agendadas...');
    await checkAndRunScheduledSearches();
  });

  logger.info('Agendador de tarefas inicializado com sucesso.');
};

/**
 * Renew tokens that are close to expiring (less than 15 days)
 */
async function renewTokens() {
  try {
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);

    const configsToRenew = await prisma.instagramConfig.findMany({
      where: {
        isConnected: true,
        tokenExpiresAt: {
          lte: fifteenDaysFromNow
        }
      }
    });

    for (const config of configsToRenew) {
      try {
        logger.info(`Renovando token para o usuário ${config.userId}...`);
        const { token, expires_in } = await getLongLivedToken(config.accessToken);
        
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + (expires_in || 5184000));

        await prisma.instagramConfig.update({
          where: { id: config.id },
          data: {
            accessToken: token,
            tokenExpiresAt: expiresAt
          }
        });
        
        logger.info(`Token renovado com sucesso para o usuário ${config.userId}`);
      } catch (error: any) {
        logger.error(`Falha ao renovar token para o usuário ${config.userId}: ${error.message}`);
      }
    }
  } catch (error: any) {
    logger.error(`Erro na tarefa de renovação de tokens: ${error.message}`);
  }
}
/**
 * Check which scheduled searches need to run now
 */
async function checkAndRunScheduledSearches() {
  const now = new Date();
  
  try {
    const pendingSearches = await prisma.scheduledSearch.findMany({
      where: {
        isActive: true,
        OR: [
          { nextRunAt: { lte: now } },
          { nextRunAt: null }
        ]
      }
    });

    if (pendingSearches.length === 0) {
      logger.info('Nenhuma pesquisa agendada pendente para este ciclo.');
      return;
    }

    logger.info(`Agendador: Encontradas ${pendingSearches.length} tarefas para processar.`);

    for (const task of pendingSearches) {
      try {
        logger.info(`Executando tarefa agendada #${task.id} (${task.query}) para usuário ${task.userId}`);
        
        // 1. Create a new search entry for this run
        const newSearch = await prisma.search.create({
          data: {
            query: task.query,
            userId: task.userId,
            status: 'PENDING',
          }
        });

        // 2. Process the search
        await processSearchInternal(newSearch.id, task.userId);

        // 3. Update task run timestamps
        // Simplified next run calculation (24h later for daily, or 1h for others)
        const nextRun = new Date();
        if (task.cronExpression.includes('0 0 * * *')) {
           nextRun.setDate(nextRun.getDate() + 1);
        } else {
           nextRun.setHours(nextRun.getHours() + 1);
        }
        
        await prisma.scheduledSearch.update({
          where: { id: task.id },
          data: {
            lastRunAt: new Date(),
            nextRunAt: nextRun
          }
        });

        logger.info(`Tarefa #${task.id} concluída com sucesso. Próxima execução: ${nextRun}`);
      } catch (taskError: any) {
        logger.error(`Erro ao executar tarefa #${task.id}: ${taskError.message}`);
      }
    }
  } catch (error: any) {
    logger.error(`Erro no agendador de pesquisas: ${error.message}`);
  }
}
