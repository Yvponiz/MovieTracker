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
    title?: string;
    name?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
    watched?: boolean;
}

export interface Cast {
    adult?: boolean,
    gender?: number | null,
    id?: number,
    known_for_department?: string,
    name: string,
    original_name?: string,
    popularity?: number,
    profile_path?: string,
    cast_id?: number,
    character?: string,
    credit_id?: string,
    order?: number
}

export interface Credits {
    id?: number,
    cast?: Cast[];
}

export interface MovieSearchResults {
    page?: number;
    results: Media[];
    credits?: Credits[];
}
