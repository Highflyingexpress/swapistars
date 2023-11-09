import React, { useCallback, useEffect, useState } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../components/CharacterCard";
import { InputSearch } from "../../components/InputSearch";

import { api } from "../../services/api";

import { ICharacter } from "../../types/Character.type";
import { Container } from "./styles";
import { PaginationButton } from "../../components/PaginationButton";
import { CompleteDataTypes } from "../../types/CompleteData.types";
import { Loading } from "../../components/Loading";
import { getUrlId } from "../../utils/getUrlId";
import { SelectButton } from "../../components/SelectButton";
import { RootState } from "../../store";
import { ICharacterFavourite } from "../../store/slices/Character.slice";
import { setFavouriteCharacter } from "../../store/slices/Character.slice";
import useDebounce from "../../utils/useDebounce";
import { PEOPLE_LS } from "../../utils/constants/localStorageKeys";

const Home: React.FC = () => {
  const [data, setData] = useState<CompleteDataTypes>();
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavouriteSelected, setIsFavouriteSelected] =
    useState<boolean>(false);

  const favouriteCharacters: ICharacterFavourite[] = useSelector(
    (state: RootState) => state.character
  );

  const debouncedOnChange = useDebounce(inputSearch, 450);
  const dispatch = useDispatch();

  const getData = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get(`people/?page=${page}`);
      const returnedData = await response.data;
      setData(returnedData);
      setCharacters(returnedData.results);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const getFilteredData = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get(`people/?search=${debouncedOnChange}`);
      const returnedData = await response.data;
      setData(returnedData);
      setCharacters(returnedData.results);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [debouncedOnChange]);

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [getData]);

  useEffect(() => {
    setIsLoading(true);
    getFilteredData();
  }, [getFilteredData]);

  useEffect(() => {
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
              value={inputSearch}
              placeholder="Type something to find somebody"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setInputSearch(event.target.value)
              }
            />
          )}

          {!inputSearch && !isFavouriteSelected && (
            <div className="pagination">
              {page === 1 ? (
                <div />
              ) : (
                <PaginationButton
                  onClick={() => setPage((prevPage) => prevPage - 1)}
                >
                  <MdArrowBackIosNew />
                </PaginationButton>
              )}

              {page < 3 ? (
                <>
                  <PaginationButton
                    isActive={page === 1}
                    onClick={() => setPage(1)}
                  >
                    1
                  </PaginationButton>
                  <PaginationButton
                    isActive={page === 2}
                    onClick={() => setPage(2)}
                  >
                    2
                  </PaginationButton>
                  <PaginationButton
                    isActive={page === 3}
                    onClick={() => setPage(3)}
                  >
                    3
                  </PaginationButton>
                </>
              ) : (
                <>
                  <PaginationButton
                    onClick={() => setPage((prevPage) => prevPage - 1)}
                  >
                    {page - 1}
                  </PaginationButton>
                  <PaginationButton isActive>{page}</PaginationButton>
                  {data?.next && (
                    <PaginationButton
                      onClick={() => setPage((prevPage) => prevPage + 1)}
                    >
                      {page + 1}
                    </PaginationButton>
                  )}
                </>
              )}

              {!data?.next ? (
                <div />
              ) : (
                <PaginationButton
                  onClick={() => setPage((prevPage) => prevPage + 1)}
                >
                  <MdArrowForwardIos />
                </PaginationButton>
              )}
            </div>
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
                  <Card
                    key={character.name}
                    imageUrl={`https://starwars-visualguide.com/assets/img/characters/${getUrlId(
                      character.url
                    )}.jpg`}
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
                  <Card
                    imageUrl={`https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg`}
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
