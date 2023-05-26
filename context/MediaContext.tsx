import React, { createContext, FunctionComponent, useContext, useState } from 'react';
import { Media } from '../models/media';

interface MediaContextData {
    media: Media | null;
    setMedia: (media: Media | null) => void;
}

const MediaContext = createContext<MediaContextData | undefined>(undefined);

interface MediaProviderProps {
    children: React.ReactNode;
}

export const MediaProvider: FunctionComponent<MediaProviderProps> = ({ children }) => {
    const [media, setMedia] = useState<Media | null>(null);

    return (
        <MediaContext.Provider value={{ media, setMedia }}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = (): MediaContextData => {
    const context = useContext(MediaContext);
    if (context === undefined) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};