import React, { useState } from "react";
import { MdStarBorder, MdStar } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  setFavouriteCharacter,
  removeFavouriteCharacter,
} from "../../store/slices/Character.slice";
import {
  removeFavoriteFilm,
  setFilmFavourite,
} from "../../store/slices/Film.slice";

interface ICardProps {
  imageUrl?: string;
  name: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  id: string;
  type: "characters" | "films";
  isFavourited: boolean;
}

export function Card({
  type,
  name,
  height,
  mass,
  hair_color,
  id,
  isFavourited = false,
}: ICardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(isFavourited);
  const dispatch = useDispatch();

  function handleFavourite() {
    if (isFavourited === false) {
      if (type === "characters") {
        dispatch(setFavouriteCharacter({ name, id, height, mass, hair_color }));
      }

      if (type === "films") {
        dispatch(setFilmFavourite({ title: name, id }));
      }
    } else {
      if (type === "characters") {
        dispatch(removeFavouriteCharacter({ name, id }));
      }

      if (type === "films") {
        dispatch(removeFavoriteFilm({ title: name, id }));
      }
    }
    setIsFavorite(!isFavorite);
  }
  return (
    <tr>
      <td>
        <Link to={`/${type}/${id}`}>
          <span className="name">{name}</span>
        </Link>
      </td>
      {type === "characters" && (
        <>
          <td>{height}</td>
          <td>{mass}</td>
          <td>{hair_color}</td>
        </>
      )}
      <td>
        <button type="button" onClick={() => handleFavourite()}>
          {!isFavorite ? <MdStarBorder size={30} /> : <MdStar size={30} />}
        </button>
      </td>
    </tr>
  );
}
