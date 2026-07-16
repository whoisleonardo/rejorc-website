// Copia local do conteudo padrao, usada apenas como fallback caso a API
// nao possa ser alcancada (ex: backend fora do ar). Assim que a API responde,
// o conteudo salvo pela gestora no /acesso sempre tem prioridade.

const COLORS = {
  purple: '#573B6F',
  gold: '#F4B030',
  green: '#378054',
  blue: '#516E90',
};

export const defaultContent = {
  site: {
    siteName: 'REJORC',
    tagline: 'Rede de Jornalismo para a Cidadania',
    logoHeader: { type: 'image', url: '' },
    logoFooter: { type: 'image', url: '' },
  },
  home_hero: {
    badge: 'Projeto de extensão · UFPR',
    title: 'Jornalismo que conecta a universidade com a cidade.',
    subtitle:
      'Somos uma rede de estudantes, professores e comunidade que produz jornalismo cidadão dentro da UFPR.',
    ctaPrimaryLabel: 'Conheça o REJORC',
    ctaSecondaryLabel: 'Ver matérias',
    heroImage: { type: 'image', url: '' },
  },
  pillars: {
    items: [
      { title: 'Formação prática', text: 'Estudantes aprendem produzindo pautas reais, do início ao fim.', color: COLORS.purple },
      { title: 'Jornalismo cidadão', text: 'Damos voz a histórias que não chegam à grande imprensa.', color: COLORS.gold },
      { title: 'Extensão universitária', text: 'Conectamos a universidade com a vida da cidade.', color: COLORS.green },
    ],
  },
  current_project: {
    badge: 'Trabalhando agora',
    title: 'Acompanhe as atualizações do projeto atual',
    text: 'A cada edição, a rede se organiza em torno de um projeto temático.',
    ctaLabel: 'Ver atualizações',
    image: { type: 'image', url: '' },
  },
  materias: { items: [] },
  fotos: { items: [] },
  sobre: {
    badge: 'Sobre o projeto',
    title: 'REJORC: Rede de Jornalismo para a Cidadania',
    text: 'O REJORC é um projeto de extensão da UFPR que forma estudantes através do jornalismo cidadão.',
    image: { type: 'image', url: '' },
    stats: [
      { value: '+40', label: 'Estudantes envolvidos', color: COLORS.purple },
      { value: '12', label: 'Matérias publicadas', color: COLORS.gold },
      { value: '6', label: 'Projetos realizados', color: COLORS.green },
    ],
    missao: [],
    passos: [],
    ctaTitle: 'Quer fazer parte do REJORC?',
    ctaText: 'Estudantes, professores e a comunidade são sempre bem-vindos.',
    ctaButtonLabel: 'Fale com a gente',
  },
  atualizacoes: {
    badge: 'Em andamento',
    title: 'Atualizações do projeto atual',
    subtitle: 'Acompanhe de perto o que a rede está produzindo.',
    coverImage: { type: 'image', url: '' },
    items: [],
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
    description: 'Rede de Jornalismo para a Cidadania — um projeto de extensão da UFPR.',
    socials: [
      { name: 'Instagram', href: '#' },
      { name: 'E-mail', href: 'mailto:contato@rejorc.ufpr.br' },
      { name: 'WhatsApp', href: '#' },
    ],
  },
  newsletter_cta: {
    title: 'Receba nossas atualizações mensais',
    text: 'Uma newsletter por mês com o que o REJORC andou fazendo. Sem spam.',
  },
};
