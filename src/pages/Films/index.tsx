import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../components/CharacterCard";
import { InputSearch } from "../../components/InputSearch";

import { api } from "../../services/api";

import { Container } from "./styles";
import { Loading } from "../../components/Loading";
import { getUrlId } from "../../utils/getUrlId";
import { IFilm } from "../../types/Film.types";
import { SelectButton } from "../../components/SelectButton";
import { RootState } from "../../store";
import useDebounce from "../../utils/useDebounce";
import {
  IFilmsFavourite,
  setFilmFavourite,
} from "../../store/slices/Film.slice";
import { FILMS_LS } from "../../utils/constants/localStorageKeys";
import { AxiosResponse } from "axios";

const MemoCard = React.memo(Card);

const Films: React.FC = () => {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [isFavouriteSelected, setIsFavouriteSelected] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const filmsFavourite = useSelector((state: RootState) => state.film);
  const debouncedOnChange = useDebounce(inputSearch, 450);
  const dispatch = useDispatch();
  const firstUpdate = useRef<boolean>(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      const fetchData = async (): Promise<void> => {
        try {
          setIsLoading(true);
          const response: AxiosResponse<{ results: IFilm[] }> = await api.get(
            `films/?search=${debouncedOnChange}`
          );
          const returnedData: IFilm[] = response.data.results;
          setFilms(returnedData);
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
        const response: AxiosResponse<{ results: IFilm[] }> = await api.get(
          `films/`
        );
        const returnedData: IFilm[] = response.data.results;

        setFilms(returnedData);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    if (!filmsFavourite.length) {
      const saved = localStorage.getItem(FILMS_LS);
      if (saved) {
        const parsed: IFilmsFavourite[] = JSON.parse(saved);
        parsed.map(({ id, title }: IFilmsFavourite) => {
          dispatch(setFilmFavourite({ id, title }));
        });
      }
    }
  }, []);

  useEffect(() => {
    const serialized = JSON.stringify(filmsFavourite);
    localStorage.setItem(FILMS_LS, serialized);
  }, [filmsFavourite]);

  return (
    <Container>
      <div className="title">
        <h1>Films</h1>
      </div>

      <div className="header">
        {!isFavouriteSelected && (
          <InputSearch
            type="text"
            value={inputSearch.trim()}
            placeholder="Type something to find any film"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setInputSearch(event.target.value.trim())
            }
          />
        )}

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

      {isLoading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : (
        <table className="maintable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Favourite</th>
            </tr>
          </thead>
          <tbody>
            {!isFavouriteSelected
              ? films.map((film) => (
                  <MemoCard
                    name={film.title}
                    key={film.title}
                    id={getUrlId(film.url)}
                    type="films"
                    isFavourited={filmsFavourite.some(
                      (data) => data.title === film.title
                    )}
                  />
                ))
              : filmsFavourite.length > 0 &&
                filmsFavourite.map((film: IFilmsFavourite) => (
                  <MemoCard
                    name={film.title}
                    key={film.title}
                    id={film.id}
                    type="films"
                    isFavourited
                  />
                ))}
          </tbody>
        </table>
      )}
      {filmsFavourite.length === 0 && isFavouriteSelected && (
        <div className="no-favourite">
          <span>No favourite films yet</span>
        </div>
      )}
    </Container>
  );
};

export default Films;
