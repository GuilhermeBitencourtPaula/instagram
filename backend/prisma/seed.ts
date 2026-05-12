import prisma from '../src/database/connection';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados `instagram`...');

  // 1. Inserir Tags Inteligentes de Nicho Padrão
  const defaultTags = [
    'nicho', 'cidade', 'produto', 'influencer', 'concorrente',
    'moda', 'fitness', 'tecnologia', 'viral', 'marketing'
  ];

  console.log('Inserindo tags padrão...');
  for (const tagName of defaultTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName }
    });
  }

  // 2. Criar Usuário Administrador Inicial Seguro
  const adminEmail = 'admin@instagramagent.com';
  const plainPassword = 'AdminSecurePassword123!'; // Exemplo seguro para o primeiro login
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  console.log('Criando usuário administrador padrão...');
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Agente IA Admin',
      passwordHash,
      role: 'ADMIN'
    }
  });

  // 3. Registrar Log Inicial de Setup do Sistema
  await prisma.log.create({
    data: {
      level: 'INFO',
      context: 'DATABASE_SEED',
      message: 'Banco de dados inicializado e populado com sucesso via Prisma Seed.',
      metaJson: JSON.stringify({ adminUserId: adminUser.id, insertedTagsCount: defaultTags.length })
    }
  });

  console.log('✅ Seed executado com sucesso!');
  console.log(`🔑 Usuário Admin de Acesso: ${adminEmail} / Senha: ${plainPassword}`);
  console.log('⚠️ RECOMENDAÇÃO: Altere a senha do administrador após o primeiro login no painel.');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
