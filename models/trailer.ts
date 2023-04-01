interface Trailer {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
}

export interface MovieWithTrailers {
    movie: {
        id: number;
        title: string;
    };
    trailers: Trailer[];
}