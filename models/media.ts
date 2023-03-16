export interface Media {
    adult?: boolean;
    backdrop_path?: string | null;
    genre_ids?: number[];
    id: number;
    media_type?: string;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string | null;
    release_date?: string;
    first_air_date?: string;
    title: string;
    name: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
    watched?: boolean;
}

export interface MovieSearchResults {
    page?: number;
    results: Media[];
}
