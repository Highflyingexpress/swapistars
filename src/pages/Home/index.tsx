import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../components/CharacterCard";
import { InputSearch } from "../../components/InputSearch";

import { api } from "../../services/api";

import { ICharacter } from "../../types/Character.type";
import { Container } from "./styles";
import { CompleteDataTypes } from "../../types/CompleteData.types";
import { Loading } from "../../components/Loading";
import { getUrlId } from "../../utils/getUrlId";
import { SelectButton } from "../../components/SelectButton";
import { RootState } from "../../store";
import { ICharacterFavourite } from "../../store/slices/Character.slice";
import { setFavouriteCharacter } from "../../store/slices/Character.slice";
import useDebounce from "../../utils/useDebounce";
import { PEOPLE_LS } from "../../utils/constants/localStorageKeys";
import { AxiosResponse } from "axios";

const MemoCard = React.memo(Card);

const Home: React.FC = () => {
  const [data, setData] = useState<CompleteDataTypes>();
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavouriteSelected, setIsFavouriteSelected] =
    useState<boolean>(false);
  const firstUpdate = useRef<boolean>(true);

  const favouriteCharacters: ICharacterFavourite[] = useSelector(
    (state: RootState) => state.character
  );

  const debouncedOnChange = useDebounce(inputSearch, 450);

  const dispatch = useDispatch();

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      const fetchData = async (): Promise<void> => {
        try {
          setIsLoading(true);
          const response: AxiosResponse<{ results: ICharacter[] }> =
            await api.get(`people/?search=${debouncedOnChange}`);
          const returnedData: ICharacter[] = response.data.results;
          setCharacters(returnedData);
        } catch {
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [debouncedOnChange]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response: AxiosResponse<{ results: ICharacter[] }> =
          await api.get(`people/?search=${debouncedOnChange}`);
        const returnedData: ICharacter[] = response.data.results;
        setCharacters(returnedData);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    if (!favouriteCharacters.length) {
      const saved = localStorage.getItem(PEOPLE_LS);
      if (saved) {
        const parsed: ICharacterFavourite[] = JSON.parse(saved);
        parsed.map(
          ({ name, id, height, mass, hair_color }: ICharacterFavourite) => {
            dispatch(
              setFavouriteCharacter({ name, id, height, mass, hair_color })
            );
          }
        );
      }
    }
  }, []);

  useEffect(() => {
    const serialized = JSON.stringify(favouriteCharacters);
    localStorage.setItem(PEOPLE_LS, serialized);
  }, [favouriteCharacters]);

  return (
    <Container>
      <div className="title">
        <h1>People</h1>
      </div>

      <div className="header">
        <div>
          <div className="select">
            <SelectButton
              type="button"
              isSelected={isFavouriteSelected === false}
              onClick={() => setIsFavouriteSelected(false)}
            >
              All
            </SelectButton>
            <SelectButton
              isSelected={isFavouriteSelected === true}
              onClick={() => setIsFavouriteSelected(true)}
            >
              Favourites
            </SelectButton>
          </div>
        </div>
        <div>
          {!isFavouriteSelected && (
            <InputSearch
              type="text"
              value={inputSearch.trim()}
              placeholder="Type something to find somebody"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setInputSearch(event.target.value.trim())
              }
            />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        <table className="maintable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Height</th>
              <th>Hair Color</th>
              <th>Mass</th>
              <th>Favourite</th>
            </tr>
          </thead>
          <tbody>
            {!isFavouriteSelected
              ? characters.map((character) => (
                  <MemoCard
                    key={character.name}
                    name={character.name}
                    height={character.height}
                    hair_color={character.hair_color}
                    mass={character.mass}
                    id={getUrlId(character.url)}
                    type="characters"
                    isFavourited={favouriteCharacters.some(
                      (favourite) => favourite.name === character.name
                    )}
                  />
                ))
              : favouriteCharacters.length > 0 &&
                favouriteCharacters.map((character: ICharacterFavourite) => (
                  <MemoCard
                    name={character.name}
                    height={character.height}
                    hair_color={character.hair_color}
                    mass={character.mass}
                    key={character.name}
                    id={character.id}
                    type="characters"
                    isFavourited
                  />
                ))}
          </tbody>
        </table>
      )}
      {favouriteCharacters.length === 0 && isFavouriteSelected && (
        <div className="no-favourites">
          <span>No favourite items yet</span>
        </div>
      )}
    </Container>
  );
};

export default Home;
