import { useCallback, useEffect, useState } from 'react';
import { IFilm } from '../types/Film.types';

type Character = {
  name: string;
  url: string;
};

export function useFilms(data: IFilm | undefined) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCharacters = useCallback(async (): Promise<void> => {
    try {
      data?.characters.forEach((character) => {
        fetch(character)
          .then((dataResponse) => dataResponse.json())
          .then((characterData) => setCharacters((prevState) => {
            if (prevState.includes(characterData.name)) return prevState;
            return [
              ...prevState,
              {
                name: characterData.name,
                url: characterData.url,
              },
            ];
          }));
      });
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [data?.characters]);

  useEffect(() => {
    setIsLoading(true);
    getCharacters();
  }, [getCharacters]);

  return {
    characters,
    isLoading,
  };
}
