// Conteudo padrao do site. E usado para popular o banco na primeira vez
// (npm run seed) e como "fallback" caso alguma secao ainda nao tenha sido
// salva no banco. A gestora pode editar tudo isso depois pelo /acesso.

const COLORS = {
  purple: '#573B6F',
  gold: '#F4B030',
  green: '#378054',
  blue: '#516E90',
};

const defaultContent = {
  site: {
    siteName: 'REJORC',
    tagline: 'Rede de Jornalismo para a Cidadania',
    logoHeader: { type: 'image', url: '/uploads/seed/logo-header.png' },
    logoFooter: { type: 'image', url: '/uploads/seed/logo-footer.png' },
  },

  home_hero: {
    badge: 'Projeto de extensão · UFPR',
    title: 'Jornalismo que conecta a universidade com a cidade.',
    subtitle:
      'Somos uma rede de estudantes, professores e comunidade que produz jornalismo cidadão dentro da UFPR, com pautas que nascem das necessidades reais de Curitiba.',
    ctaPrimaryLabel: 'Conheça o REJORC',
    ctaSecondaryLabel: 'Ver matérias',
    heroImage: { type: 'image', url: '/uploads/seed/hero-illustration.png' },
  },

  pillars: {
    items: [
      { title: 'Formação prática', text: 'Estudantes aprendem apuração, edição e produção de reportagens trabalhando em pautas reais, do início ao fim.', color: COLORS.purple },
      { title: 'Jornalismo cidadão', text: 'Damos voz a histórias e demandas da comunidade que muitas vezes não chegam à grande imprensa.', color: COLORS.gold },
      { title: 'Extensão universitária', text: 'Conectamos o conhecimento produzido na universidade com a vida da cidade, de forma prática e contínua.', color: COLORS.green },
    ],
  },

  current_project: {
    badge: 'Trabalhando agora',
    title: 'Acompanhe as atualizações do projeto atual',
    text: 'A cada edição, a rede se organiza em torno de um projeto temático, com pautas, entrevistas e produções que são publicadas ao longo dos meses.',
    ctaLabel: 'Ver atualizações',
    image: { type: 'image', url: '' },
  },

  materias: {
    badge: 'Matérias',
    title: 'Reportagens produzidas pela rede',
    subtitle: 'Acompanhe as reportagens, entrevistas, colunas e opiniões produzidas pelos estudantes do REJORC.',
    bannerText: 'As reportagens completas e o acervo histórico do curso ficam no site do jornal Comunicação.',
    bannerButtonLabel: 'Visitar site do jornal ↗',
    bannerUrl: '',
    items: [
      { id: 'm1', tag: 'Reportagem', title: 'Como a comunidade ao redor da UFPR enxerga o campus', excerpt: 'Uma conversa com moradores do entorno sobre a relação entre universidade e bairro.', color: COLORS.purple, category: 'reportagem', date: 'Jun 2026', image: { type: 'image', url: '' }, link: '' },
      { id: 'm2', tag: 'Entrevista', title: 'Professor da UFPR fala sobre o papel do jornalismo local', excerpt: 'Bate-papo sobre os desafios e oportunidades do jornalismo feito de perto.', color: COLORS.gold, category: 'entrevista', date: 'Mai 2026', image: { type: 'image', url: '' }, link: '' },
      { id: 'm3', tag: 'Opinião', title: 'Por que jornalismo cidadão importa na universidade pública', excerpt: 'Um texto sobre o compromisso social do curso de Comunicação.', color: COLORS.green, category: 'opiniao', date: 'Mai 2026', image: { type: 'image', url: '' }, link: '' },
      { id: 'm4', tag: 'Reportagem', title: 'Bastidores de uma oficina de apuração da rede', excerpt: 'Como os estudantes se preparam antes de ir a campo.', color: COLORS.purple, category: 'reportagem', date: 'Abr 2026', image: { type: 'image', url: '' }, link: '' },
      { id: 'm5', tag: 'Coluna', title: 'O que aprendemos organizando pautas com a comunidade', excerpt: 'Reflexões da equipe sobre o processo de escuta antes da produção.', color: COLORS.blue, category: 'coluna', date: 'Abr 2026', image: { type: 'image', url: '' }, link: '' },
      { id: 'm6', tag: 'Entrevista', title: 'Egressa do curso conta como o REJORC mudou sua trajetória', excerpt: 'Depoimento de quem passou pela rede e hoje atua no mercado.', color: COLORS.gold, category: 'entrevista', date: 'Mar 2026', image: { type: 'image', url: '' }, link: '' },
    ],
  },

  fotos: {
    badge: 'Registros',
    title: 'Coisas que já fizemos',
    subtitle: 'Registros de oficinas, coberturas e bastidores do REJORC — em fotos, vídeos e áudios.',
    ctaTitle: 'Fez parte de algum projeto com a gente?',
    ctaText: 'Manda sua foto, vídeo ou áudio e a gente inclui no acervo do REJORC.',
    ctaButtonLabel: 'Enviar registro',
    items: [
      { id: 'f1', type: 'image', url: '', label: 'Oficina de jornalismo' },
      { id: 'f2', type: 'image', url: '', label: 'Cobertura de evento' },
      { id: 'f3', type: 'image', url: '', label: 'Reunião de pauta' },
      { id: 'f4', type: 'image', url: '', label: 'Entrevista em campo' },
      { id: 'f5', type: 'image', url: '', label: 'Redação da rede' },
      { id: 'f6', type: 'image', url: '', label: 'Lançamento de matéria' },
      { id: 'f7', type: 'image', url: '', label: 'Estúdio de gravação' },
      { id: 'f8', type: 'image', url: '', label: 'Equipe do REJORC' },
      { id: 'f9', type: 'image', url: '', label: 'Visita à comunidade' },
    ],
  },

  sobre: {
    badge: 'Sobre o projeto',
    title: 'REJORC: Rede de Jornalismo para a Cidadania',
    text:
      'O REJORC é um projeto de extensão da UFPR que forma estudantes de Comunicação através da prática do jornalismo cidadão, produzindo reportagens, entrevistas e coberturas em parceria direta com a comunidade de Curitiba.',
    image: { type: 'image', url: '' },
    stats: [
      { value: '+40', label: 'Estudantes envolvidos', color: COLORS.purple },
      { value: '12', label: 'Matérias publicadas', color: COLORS.gold },
      { value: '6', label: 'Projetos realizados', color: COLORS.green },
    ],
    missao: [
      { title: 'Democratizar a informação', text: 'Levar jornalismo de qualidade a quem normalmente não é ouvido pela grande imprensa.', color: COLORS.purple },
      { title: 'Formar jornalistas cidadãos', text: 'Preparar estudantes para uma prática profissional comprometida com a comunidade.', color: COLORS.gold },
      { title: 'Aproximar UFPR e comunidade', text: 'Criar pontes reais entre a universidade e os bairros ao seu redor.', color: COLORS.green },
      { title: 'Fortalecer o jornalismo local', text: 'Valorizar pautas de proximidade que fortalecem a vida pública da cidade.', color: COLORS.blue },
    ],
    passos: [
      { n: '1', title: 'Formação', text: 'Oficinas de apuração, entrevista e escrita para os estudantes da rede.', color: COLORS.purple },
      { n: '2', title: 'Pauta', text: 'Escuta da comunidade e definição conjunta dos temas a serem cobertos.', color: COLORS.gold },
      { n: '3', title: 'Produção', text: 'Apuração, entrevistas e produção das reportagens em campo.', color: COLORS.green },
      { n: '4', title: 'Publicação', text: 'Edição final e publicação no site e nas redes do projeto.', color: COLORS.blue },
    ],
    ctaTitle: 'Quer fazer parte do REJORC?',
    ctaText: 'Estudantes, professores e moradores da comunidade são sempre bem-vindos para colaborar com o projeto.',
    ctaButtonLabel: 'Fale com a gente',
  },

  atualizacoes: {
    badge: 'Em andamento',
    title: 'Atualizações do projeto atual',
    subtitle: 'Acompanhe de perto o que a rede está produzindo neste momento.',
    coverImage: { type: 'image', url: '' },
    items: [
      { date: 'Jun 2026', title: 'Início da produção da nova série de reportagens', text: 'A equipe começou a apuração das próximas pautas definidas com a comunidade.', color: COLORS.purple },
      { date: 'Mai 2026', title: 'Oficina de apuração com estudantes da rede', text: 'Encontro formativo sobre técnicas de entrevista e checagem de informação.', color: COLORS.gold },
      { date: 'Abr 2026', title: 'Parceria firmada com o jornal Comunicação', text: 'A rede passa a colaborar oficialmente com o jornal-laboratório do curso.', color: COLORS.green },
      { date: 'Mar 2026', title: 'Primeiras pautas definidas com a comunidade', text: 'Reuniões abertas para ouvir demandas de moradores do entorno da UFPR.', color: COLORS.blue },
      { date: 'Fev 2026', title: 'Lançamento oficial do projeto REJORC', text: 'Início das atividades da rede com a primeira turma de estudantes.', color: COLORS.purple },
    ],
  },

  contato: {
    badge: 'Contato',
    title: 'Fale com a gente',
    subtitle: 'Dúvidas, sugestões de pauta, parcerias ou vontade de participar? Manda pra gente.',
    address: 'Setor de Artes, Comunicação e Design\nUniversidade Federal do Paraná\nCuritiba, PR',
    email: 'contato@rejorc.ufpr.br',
    instagram: '@rejorc.ufpr',
    whatsapp: '',
  },

  footer: {
    description:
      'Rede de Jornalismo para a Cidadania — um projeto de extensão da UFPR que conecta estudantes, professores e comunidade através do jornalismo.',
    socials: [
      { name: 'Instagram', href: 'https://www.instagram.com/rejorc.ufpr/' },
      { name: 'E-mail', href: 'mailto:contato@rejorc.ufpr.br' },
      { name: 'WhatsApp', href: '' },
    ],
  },

  newsletter_cta: {
    title: 'Receba nossas atualizações mensais',
    text: 'Uma newsletter por mês com o que o REJORC andou fazendo. Sem spam.',
  },
};

module.exports = { defaultContent, COLORS };
