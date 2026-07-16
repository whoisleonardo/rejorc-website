/**
 * Ícones de redes sociais (SVG inline, sem dependência externa).
 * O ícone é escolhido pelo nome cadastrado no painel ("Instagram",
 * "E-mail", "WhatsApp", "YouTube", "TikTok", "Facebook"...). Nomes não
 * reconhecidos ganham um ícone genérico de link.
 */

const PATHS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.3" fill="currentColor" />
    </>
  ),
  email: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3.5 7l8.5 6 8.5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  whatsapp: (
    <>
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5c-.5 2.5 3 6.5 5.5 6.5.8 0 1.5-.7 1.5-1.3l-1.8-1.2-1.2.7c-.9-.4-2-1.5-2.4-2.4l.7-1.2L10.1 8c-.6 0-1 .2-1.1.5z"
        fill="currentColor"
      />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="6" width="19" height="13" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 9.8v5.4l4.6-2.7z" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path
      d="M15 4c.4 2 1.8 3.4 4 3.7v3c-1.6 0-3-.5-4-1.3v5.3A5.3 5.3 0 1 1 9.7 9.4v3.1a2.3 2.3 0 1 0 2.3 2.3V4h3z"
      fill="currentColor"
    />
  ),
  facebook: (
    <path
      d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H9v3h2.3v7h2.2z"
      fill="currentColor"
    />
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 6 .4l3-3a4 4 0 0 0-5.6-5.6l-1.7 1.7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 10a4 4 0 0 0-6-.4l-3 3a4 4 0 0 0 5.6 5.6l1.7-1.7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export function iconKeyFor(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('insta')) return 'instagram';
  if (n.includes('mail')) return 'email';
  if (n.includes('whats') || n.includes('zap')) return 'whatsapp';
  if (n.includes('you')) return 'youtube';
  if (n.includes('tik')) return 'tiktok';
  if (n.includes('face')) return 'facebook';
  return 'link';
}

export default function SocialIcon({ name, size = 18, color = 'currentColor', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={name}
      style={{ color, display: 'block', ...style }}
    >
      {PATHS[iconKeyFor(name)]}
    </svg>
  );
}
