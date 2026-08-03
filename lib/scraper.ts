// Re-written using Jikan API (MyAnimeList) since the previous site aggressively blocks the Google Cloud Run Edge IPs with Cloudflare.
const BASE_URL = 'https://api.jikan.moe/v4';

async function fetchJikan(endpoint: string) {
  try {
    const url = BASE_URL + endpoint;
    const response = await fetch(url, {
      next: { revalidate: 3600 } 
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Jikan:`, error instanceof Error ? error.message : error);
    return { data: [], pagination: { has_next_page: false } };
  }
}

export interface AnimeItem {
  title: string;
  link: string;
  slug: string;
  poster: string | null;
  status: string | null;
  type: string | null;
  episode: string | null;
  sub: string | null;
}

export interface AnimeListResponse {
  items: AnimeItem[];
  currentPage: number;
  hasNext: boolean;
}

function mapAnime(item: any): AnimeItem {
  return {
    title: item.title,
    link: `/anime/${item.mal_id}`,
    slug: String(item.mal_id),
    poster: item.images?.webp?.image_url || item.images?.jpg?.image_url || null,
    status: item.status,
    type: item.type,
    episode: item.episodes ? `${item.episodes} Eps` : null,
    sub: item.season ? `${item.season} ${item.year}` : null,
  };
}

export async function getHome(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/seasons/now?page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getNew(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?status=airing&order_by=start_date&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getTop(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/top/anime?page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getPopular(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/top/anime?filter=bypopularity&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getUpcoming(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/seasons/upcoming?page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getMovies(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?type=movie&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getAction(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=1&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getRomance(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=22&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getComedy(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=4&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getAdventure(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=2&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getSciFi(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=24&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getFantasy(page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=10&order_by=popularity&sort=desc&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}


export async function getSearch(query: string, page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?q=${encodeURIComponent(query)}&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getGenresList() {
  const data = await fetchJikan(`/genres/anime`);
  const items: { name: string; count: number | null; slug: string }[] = [];
  if (data.data && Array.isArray(data.data)) {
    data.data.forEach((g: any) => {
      items.push({
        name: g.name,
        count: g.count,
        slug: String(g.mal_id),
      });
    });
  }
  return items;
}

export async function getGenre(slug: string, page: number = 1): Promise<AnimeListResponse> {
  const data = await fetchJikan(`/anime?genres=${slug}&page=${page}`);
  return {
    items: (data.data || []).map(mapAnime),
    currentPage: page,
    hasNext: data.pagination?.has_next_page || false,
  };
}

export async function getDetail(slug: string) {
  const details = await fetchJikan(`/anime/${slug}/full`);
  const eps = await fetchJikan(`/anime/${slug}/episodes`);

  const info = details.data || {};
  
  const episodes: { number: string | null; title: string | null; slug: string; date: string | null }[] = [];
  if (eps.data && Array.isArray(eps.data)) {
    eps.data.forEach((ep: any) => {
      episodes.push({
        number: String(ep.mal_id),
        title: ep.title,
        slug: `${slug}-${ep.mal_id}`,
        date: ep.aired ? new Date(ep.aired).toLocaleDateString() : null
      });
    });
  }

  return {
    slug,
    title: info.title || "Unknown",
    poster: info.images?.webp?.large_image_url || info.images?.jpg?.large_image_url || null,
    rating: info.score || null,
    status: info.status || null,
    studio: info.studios?.[0]?.name || null,
    released: info.aired?.string || null,
    duration: info.duration || null,
    type: info.type || null,
    totalEps: info.episodes ? String(info.episodes) : null,
    genres: (info.genres || []).map((g: any) => ({ name: g.name, slug: String(g.mal_id) })),
    synopsis: info.synopsis || null,
    episodes
  };
}

export async function getEpisode(slug: string) {
  // slug format: animeId-episodeId
  const parts = slug.split('-');
  const animeId = parts[0];
  const epId = parts.slice(1).join('-');

  const animeFull = await fetchJikan(`/anime/${animeId}`);
  const details = await fetchJikan(`/anime/${animeId}/episodes/${epId}`);
  const allEps = await fetchJikan(`/anime/${animeId}/episodes`);
  
  const epData = details.data || {};
  const allEpsData = allEps.data || [];

  let prevEpisode = null;
  let nextEpisode = null;

  const currentIdx = allEpsData.findIndex((e: any) => String(e.mal_id) === epId);
  if (currentIdx !== -1) {
    if (currentIdx > 0) prevEpisode = `${animeId}-${allEpsData[currentIdx - 1].mal_id}`;
    if (currentIdx < allEpsData.length - 1) nextEpisode = `${animeId}-${allEpsData[currentIdx + 1].mal_id}`;
  }

  return {
    title: epData.title ? `${animeFull.data?.title || 'Anime'} - Episode ${epId}: ${epData.title}` : `${animeFull.data?.title || 'Anime'} - Episode ${epId}`,
    iframeUrl: `https://animeplay.cfd/stream/mal/${animeId}/${epId}/sub`,
    videoUrl: null,
    prevEpisode,
    nextEpisode,
    allEpisodesSlug: animeId,
    episodeList: allEpsData.map((e: any) => ({
      title: e.title || `Episode ${e.mal_id}`,
      slug: `${animeId}-${e.mal_id}`,
      info: e.aired ? new Date(e.aired).toLocaleDateString() : ''
    }))
  };
}

export async function getSchedule(day: string): Promise<AnimeItem[]> {
  const daysMap: Record<string, string> = {
    'senin': 'monday',
    'selasa': 'tuesday',
    'rabu': 'wednesday',
    'kamis': 'thursday',
    'jumat': 'friday',
    'sabtu': 'saturday',
    'minggu': 'sunday'
  };
  
  const englishDay = daysMap[day.toLowerCase()] || 'monday';
  const data = await fetchJikan(`/schedules?filter=${englishDay}`);
  // Add time manually since Jikan doesn't return exact airing times in schedule list without extra parsing
  return (data.data || []).map((item: any) => {
    const ai = mapAnime(item);
    return {
      ...ai,
      time: item.broadcast?.time || "TBA"
    };
  });
}
