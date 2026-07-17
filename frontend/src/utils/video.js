// Detecta a plataforma de video a partir da URL colada pela gestora e monta
// a URL de embed correta. Cobre YouTube, TikTok e Instagram (Reels/posts).

export function getEmbedInfo(rawUrl) {
  if (!rawUrl) return null;
  let url;
  try {
    url = new URL(rawUrl);
  } catch (e) {
    return null;
  }
  const host = url.hostname.replace('www.', '');

  // YouTube: youtube.com/watch?v=ID | youtu.be/ID | youtube.com/shorts/ID
  const YT_ID_RE = /^[\w-]+$/;
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const v = url.searchParams.get('v');
    const shortsMatch = url.pathname.match(/\/shorts\/([\w-]+)/);
    const id = (v && YT_ID_RE.test(v) && v) || (shortsMatch ? shortsMatch[1] : null);
    if (id) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
  }
  if (host === 'youtu.be') {
    const id = url.pathname.replace('/', '');
    if (id && YT_ID_RE.test(id)) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` };
  }

  // TikTok: tiktok.com/@user/video/ID
  if (host === 'tiktok.com') {
    const match = url.pathname.match(/\/video\/(\d+)/);
    if (match) return { platform: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}` };
  }

  // Instagram: instagram.com/reel/CODE/ or /p/CODE/
  if (host === 'instagram.com') {
    const match = url.pathname.match(/\/(reel|p|tv)\/([\w-]+)/);
    if (match) return { platform: 'instagram', embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed` };
  }

  // Spotify: open.spotify.com/[intl-xx/]track|episode|show|album|playlist/ID
  if (host === 'open.spotify.com') {
    const match = url.pathname.match(/^\/(?:intl-[a-z-]+\/)?(track|episode|show|album|playlist)\/([A-Za-z0-9]+)/);
    if (match) return { platform: 'spotify', embedUrl: `https://open.spotify.com/embed/${match[1]}/${match[2]}` };
  }

  return null;
}

// Tipos oferecidos no painel. YouTube saiu das opcoes de cadastro, mas
// itens antigos com type "youtube" continuam sendo exibidos no site.
export const VIDEO_TYPES = [
  { value: 'image', label: 'Imagem' },
  { value: 'audio', label: 'Áudio' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'tiktok', label: 'Vídeo do TikTok' },
  { value: 'instagram', label: 'Reels do Instagram' },
];
