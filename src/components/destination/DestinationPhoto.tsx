import { useEffect, useState } from 'react';
import type { Destination } from '@/types';

interface CommonsPhoto {
  thumbnail: string;
  filePage: string;
  credit: string;
  license: string;
}

interface CommonsApiResponse {
  query?: {
    pages?: Record<string, {
      title?: string;
      imageinfo?: Array<{
        thumburl?: string;
        descriptionurl?: string;
        extmetadata?: Record<string, { value?: string }>;
      }>;
    }>;
  };
}

const photoCache = new Map<string, Promise<CommonsPhoto | null>>();

const CURATED_PHOTO_SOURCES: Record<string, string> = {
  'rajanawa-ella': 'https://www.tripadvisor.in/LocationPhotoDirectLink-g2467853-i476828904-Ratnapura_Sabaragamuwa_Province.html',
  'suudagala-ella': 'https://lakdasun43.rssing.com/chan-18060207/all_p33.html',
  'mapalana-ella': 'https://commons.wikimedia.org/wiki/File:Mapalana_Waterfalls.jpg',
  'adams-peak': 'https://commons.wikimedia.org/wiki/File:Shadow_of_the_peak_when_sun_rising.jpg',
  'sinharaja-forest-reserve': 'https://commons.wikimedia.org/wiki/File:Siharaja_Forest_Canopy_Sri_Lanka.jpg',
  'bopath-ella-falls': 'https://commons.wikimedia.org/wiki/File:Bopath_Ella_Waterfall.jpg',
  'ratnapura-national-museum': 'https://www.tripadvisor.com/Attraction_Review-g2467853-d8398216-Reviews-National_Museum_Ratnapura-Ratnapura_Sabaragamuwa_Province.html',
  'saman-dewalaya-ratnapura': 'https://commons.wikimedia.org/wiki/File:Maha_Saman_Devalaya.jpg',
  'katugas-ella': 'https://www.sab.ac.lk/med/node/620',
};

function findCommonsPhoto(destination: Destination): Promise<CommonsPhoto | null> {
  const key = destination.slug;
  const cached = photoCache.get(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `"${destination.name}" ${destination.district} Sri Lanka`,
    gsrnamespace: '6',
    gsrlimit: '5',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '1400',
    format: 'json',
    origin: '*',
  });
  const request = fetch(`https://commons.wikimedia.org/w/api.php?${params}`)
    .then(async (response) => {
      if (!response.ok) return null;
      const data = await response.json() as CommonsApiResponse;
      const pages = Object.values(data.query?.pages ?? {});
      const matchingPage = pages.find((page) => page.imageinfo?.[0]?.thumburl);
      const info = matchingPage?.imageinfo?.[0];
      if (!info?.thumburl || !info.descriptionurl) return null;
      const metadata = info.extmetadata ?? {};
      const credit = (metadata.Artist?.value ?? metadata.Credit?.value ?? 'Wikimedia Commons contributor')
        .replace(/<[^>]*>/g, '').trim();
      const license = (metadata.LicenseShortName?.value ?? '').replace(/<[^>]*>/g, '').trim();
      return { thumbnail: info.thumburl, filePage: info.descriptionurl, credit, license };
    })
    .catch(() => null);
  photoCache.set(key, request);
  return request;
}

interface DestinationPhotoProps {
  destination: Destination;
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fallbackSrc?: string;
  resolve?: boolean;
}

/** Uses a place-specific freely licensed Commons photograph when available, keeping the bundled image as a fallback. */
export function DestinationPhoto({ destination, alt, className, loading = 'lazy', fallbackSrc, resolve = true }: DestinationPhotoProps) {
  const [photo, setPhoto] = useState<CommonsPhoto | null>(null);

  useEffect(() => {
    setPhoto(null);
    // Keep hand-picked destination photos in place instead of letting the broad
    // Commons search replace them with a different place or mismatched credit.
    if (!resolve || CURATED_PHOTO_SOURCES[destination.slug]) return;
    let active = true;
    void findCommonsPhoto(destination).then((result) => {
      if (active) setPhoto(result);
    });
    return () => { active = false; };
  }, [destination, resolve]);

  const imageSrc = photo?.thumbnail ?? fallbackSrc ?? destination.coverImage;
  const photoCredit = photo
    ? `Photo: ${photo.credit}${photo.license ? ` · ${photo.license}` : ''}`
    : CURATED_PHOTO_SOURCES[destination.slug]
      ? `Photo: ${destination.images[0]?.caption ?? destination.name}`
      : null;
  const photoSource = photo?.filePage ?? CURATED_PHOTO_SOURCES[destination.slug];

  return (
    <span className={`group/photo relative block overflow-hidden ${className ?? ''}`}>
      <img
        src={imageSrc}
        alt={alt ?? destination.name}
        className="h-full w-full object-cover"
        loading={loading}
        referrerPolicy="no-referrer"
        onError={(event) => {
          if (photo && event.currentTarget.src !== imageSrc) {
            event.currentTarget.src = fallbackSrc ?? destination.coverImage;
          }
        }}
      />
      {photoCredit && photoSource && (
        <a
          href={photoSource}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="absolute bottom-1.5 right-1.5 max-w-[90%] truncate rounded-md bg-black/65 px-1.5 py-1 text-[9px] leading-none text-white/90 opacity-100"
          title={photoCredit}
        >
          {photoCredit}
        </a>
      )}
    </span>
  );
}
