const AVATAR_STYLES = [
  { id: 'adventurer', name: 'Adventurer', url: (s: string) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${s}` },
  { id: 'adventurer-neutral', name: 'Adventurer Neutral', url: (s: string) => `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${s}` },
  { id: 'avataaars', name: 'Avataaars', url: (s: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${s}` },
  { id: 'big-ears', name: 'Big Ears', url: (s: string) => `https://api.dicebear.com/7.x/big-ears/svg?seed=${s}` },
  { id: 'big-smile', name: 'Big Smile', url: (s: string) => `https://api.dicebear.com/7.x/big-smile/svg?seed=${s}` },
  { id: 'bottts', name: 'Bottts', url: (s: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${s}` },
  { id: 'croodles', name: 'Croodles', url: (s: string) => `https://api.dicebear.com/7.x/croodles/svg?seed=${s}` },
  { id: 'fun-emoji', name: 'Fun Emoji', url: (s: string) => `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${s}` },
  { id: 'icons', name: 'Icons', url: (s: string) => `https://api.dicebear.com/7.x/icons/svg?seed=${s}` },
  { id: 'lorelei', name: 'Lorelei', url: (s: string) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${s}` },
  { id: 'micah', name: 'Micah', url: (s: string) => `https://api.dicebear.com/7.x/micah/svg?seed=${s}` },
  { id: 'miniavs', name: 'Miniavs', url: (s: string) => `https://api.dicebear.com/7.x/miniavs/svg?seed=${s}` },
  { id: 'notionists', name: 'Notionists', url: (s: string) => `https://api.dicebear.com/7.x/notionists/svg?seed=${s}` },
  { id: 'open-peeps', name: 'Open Peeps', url: (s: string) => `https://api.dicebear.com/7.x/open-peeps/svg?seed=${s}` },
  { id: 'personas', name: 'Personas', url: (s: string) => `https://api.dicebear.com/7.x/personas/svg?seed=${s}` },
  { id: 'pixel-art', name: 'Pixel Art', url: (s: string) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${s}` },
  { id: 'rings', name: 'Rings', url: (s: string) => `https://api.dicebear.com/7.x/rings/svg?seed=${s}` },
  { id: 'shapes', name: 'Shapes', url: (s: string) => `https://api.dicebear.com/7.x/shapes/svg?seed=${s}` },
  { id: 'thumbs', name: 'Thumbs', url: (s: string) => `https://api.dicebear.com/7.x/thumbs/svg?seed=${s}` },
]

const DEFAULT_STYLE = 'avataaars'

export function getAvatarUrl(email: string, avatarUrl?: string | null): string {
  if (avatarUrl && avatarUrl.startsWith('http')) return avatarUrl
  const style = avatarUrl || DEFAULT_STYLE
  const seed = encodeURIComponent(email)
  const found = AVATAR_STYLES.find(s => s.id === style)
  if (found) return found.url(seed)
  return AVATAR_STYLES.find(s => s.id === DEFAULT_STYLE)!.url(seed)
}

export { AVATAR_STYLES, DEFAULT_STYLE }
