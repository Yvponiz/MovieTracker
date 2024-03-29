import { Media } from "./media";

interface ProductionCompany {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
}

interface Genre {
    id: number;
    name: string;
}

interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}

interface Collection {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
}

export interface MediaPage {
    adult?: boolean;
    backdrop_path?: string | null;
    belongs_to_collection: Collection;
    budget: number;
    first_air_date?: string;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    name?: string;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string | null;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    release_date?: string;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
}

export interface MediaPageExtended extends MediaPage, Media {}