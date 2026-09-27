export interface NaturePhoto {
  id: string;
  url: string;
  location: string;
  caption: string;
}

export const NATURE_PHOTOS: NaturePhoto[] = [
  {
    id: 'nature-1',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    location: 'Yosemite Valley, California',
    caption: 'Misty morning sun rising over peaceful river waters and towering granite peaks.'
  },
  {
    id: 'nature-2',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    location: 'Alpine Mountain Crest',
    caption: 'Majestic mountain ridges enfolded in soft clouds of morning mist.'
  },
  {
    id: 'nature-3',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    location: 'Ancient Sunlit Forest',
    caption: 'Radiant beams of heavenly morning light shining through quiet forest trees.'
  },
  {
    id: 'nature-4',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    location: 'Tranquil Mountain Meadow',
    caption: 'Rolling emerald pastures beneath an open, glowing evening sky.'
  },
  {
    id: 'nature-5',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    location: 'Lush Forest Canopy',
    caption: 'Warm golden rays penetrating the lush green leaves of God’s creation.'
  },
  {
    id: 'nature-6',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    location: 'Peaceful Ocean Shore',
    caption: 'Gentle golden sunset waves whispering peace along the sandy shore.'
  },
  {
    id: 'nature-7',
    url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80',
    location: 'Turquoise Mountain Lake',
    caption: 'Still and mirror-like waters reflecting majestic snow-touched heights.'
  },
  {
    id: 'nature-8',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
    location: 'Green Pastures and Quiet Waters',
    caption: 'He maketh me to lie down in green pastures; He leadeth me beside the still waters.'
  },
  {
    id: 'nature-9',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    location: 'Starry Heavens over Mountain Peaks',
    caption: 'The heavens declare the glory of God; and the firmament sheweth his handywork.'
  },
  {
    id: 'nature-10',
    url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=80',
    location: 'Cascading Forest Waterfall',
    caption: 'Pure streams of living water flowing through lush wilderness stones.'
  },
  {
    id: 'nature-11',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    location: 'Serene Alpine Lake & Peaks',
    caption: 'Quiet reflections upon deep waters surrounded by majestic mountain slopes.'
  },
  {
    id: 'nature-12',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    location: 'Dramatic Mountain Summit',
    caption: 'Everlasting hills standing firm under the boundless blue skies.'
  },
  {
    id: 'nature-13',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    location: 'Warm Desert Horizon at Sunset',
    caption: 'Golden glowing sands and quiet horizons stretching into peaceful twilight.'
  },
  {
    id: 'nature-14',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    location: 'Foggy Cedar Grove',
    caption: 'Tall evergreens enveloped in cool mountain mist of dawn.'
  },
  {
    id: 'nature-15',
    url: 'https://images.unsplash.com/photo-1498887960847-2a5e46312788?auto=format&fit=crop&w=1200&q=80',
    location: 'Radiant Mountain Sunrise',
    caption: 'Thy mercies are new every morning: great is Thy faithfulness.'
  },
  {
    id: 'nature-16',
    url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
    location: 'Autumn River Valley',
    caption: 'Gentle winding waters amidst the peaceful warmth of autumn colors.'
  },
  {
    id: 'nature-17',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    location: 'Pine Forest under Clouded Skies',
    caption: 'Quiet majesty of towering pines lifting praise to the heavens.'
  },
  {
    id: 'nature-18',
    url: 'https://images.unsplash.com/photo-1475921088770-a02a9e527d2f?auto=format&fit=crop&w=1200&q=80',
    location: 'Dawn Over Ocean Horizon',
    caption: 'The sunrise breaks through the dark, bringing joy in the morning.'
  }
];

export function getRandomNaturePhoto(bookName: string, randomSeed?: number): NaturePhoto {
  if (randomSeed !== undefined) {
    const idx = Math.abs(randomSeed) % NATURE_PHOTOS.length;
    return NATURE_PHOTOS[idx];
  }
  // Deterministic seed based on book name combined with a subtle random pool
  let hash = 0;
  for (let i = 0; i < bookName.length; i++) {
    hash = (hash << 5) - hash + bookName.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % NATURE_PHOTOS.length;
  return NATURE_PHOTOS[index];
}
