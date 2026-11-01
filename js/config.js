// EGOIST Website Configuration
// All editable content lives here

export const config = {
  // Social Links
  tiktok: 'https://www.tiktok.com/@egoist_bloodstrike',
  youtube: 'https://www.youtube.com/@Egoistfps_YT',
  whatsapp: 'https://whatsapp.com/channel/0029Vb8g6d2HrDZfhEhgpJ1z',

  // Business Email
  email: 'fpsegoist1@gmail.com',

  // Funny Clips (TikTok)
  funnyClips: [
    { id: 1, url: 'https://vt.tiktok.com/ZSgKxNjNP/', label: 'CLIP 01' },
    { id: 2, url: 'https://vt.tiktok.com/ZSgKxm5kx/', label: 'CLIP 02' },
    { id: 3, url: 'https://vt.tiktok.com/ZSgKxVcfd/', label: 'CLIP 03' },
    { id: 4, url: 'https://vt.tiktok.com/ZSgKxxjdh/', label: 'CLIP 04' },
    { id: 5, url: 'https://vt.tiktok.com/ZSgKxbHU8/', label: 'CLIP 05' }
  ],

  // Edits (TikTok)
  edits: [
    { id: 1, url: 'https://vt.tiktok.com/ZSgKxnPs1/', label: 'EDIT 01' },
    { id: 2, url: 'https://vt.tiktok.com/ZSgKQByRD/', label: 'EDIT 02' },
    { id: 3, url: 'https://vt.tiktok.com/ZSgKQM5kB/', label: 'EDIT 03' },
    { id: 4, url: 'https://vt.tiktok.com/ZSgKQDAoW/', label: 'EDIT 04' },
    { id: 5, url: 'https://vt.tiktok.com/ZSgKQ8twh/', label: 'EDIT 05' }
  ],

  // Join Cards
  joinCards: [
    {
      platform: 'tiktok',
      handle: '@egoist_bloodstrike',
      url: 'https://www.tiktok.com/@egoist_bloodstrike',
      cta: 'Follow on TikTok'
    },
    {
      platform: 'youtube',
      handle: '@Egoistfps_YT',
      url: 'https://www.youtube.com/@Egoistfps_YT',
      cta: 'Subscribe on YouTube'
    },
    {
      platform: 'whatsapp',
      handle: 'WhatsApp Channel',
      url: 'https://whatsapp.com/channel/0029Vb8g6d2HrDZfhEhgpJ1z',
      cta: 'Join Channel'
    }
  ],

  // Footer Social Links
  footerSocial: [
    { platform: 'tiktok', url: 'https://www.tiktok.com/@egoist_bloodstrike' },
    { platform: 'youtube', url: 'https://www.youtube.com/@Egoistfps_YT' },
    { platform: 'whatsapp', url: 'https://whatsapp.com/channel/0029Vb8g6d2HrDZfhEhgpJ1z' }
  ]
};

// Platform Icons (SVG paths)
export const icons = {
  tiktok: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z',
  play: 'M8 5v14l11-7z'
};
