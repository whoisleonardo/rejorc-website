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

  return null;
}

export const VIDEO_TYPES = [
  { value: 'image', label: 'Imagem' },
  { value: 'youtube', label: 'Vídeo do YouTube' },
  { value: 'tiktok', label: 'Vídeo do TikTok' },
  { value: 'instagram', label: 'Reels do Instagram' },
];
