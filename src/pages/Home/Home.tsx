import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
import Heart from "react-animated-heart";

import banner from "../../assets/banner.png";
import errorBanner from "../../assets/error.svg";
import api from "../../services/api";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Container, Content, List, Filter, Error } from "./styles";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../../services/firebase";
interface IGame {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
}

interface IFavorite {
  id: string;
  user_id: string;
  game_id: number;
}

interface User {
  id: string;
  token: string;
}

const Home = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [games, setGameList] = useState<IGame[]>([]);
  const [backupList, setBackupList] = useState<IGame[]>([]);
  const [favorites, setFavoriteList] = useState<IFavorite[]>([]);

  const [genre, setGenre] = useState("");
  const genresArray = [
    "Shooter",
    "MMOARPG",
    "ARPG",
    "Fighting",
    "Action RPG",
    "Battle Royale",
    "MMORPG",
    "MOBA",
    "Sports",
    "Racing",
    "Card Game",
    "Strategy",
    "MMO",
    "Social",
    "Fantasy",
  ];

  useEffect(() => {
    loadFavoriteList();
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGenresChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setGameList(backupList);
    const genre = event.target.value;

    if (genre === "Gênero") {
      setGenre("");
    }

    setLoading(true);
    const newGames = backupList.filter((game) =>
      (game.genre === genre &&
        (searchValue
          ? game.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          : true)) ||
      genre === "Gênero"
        ? game.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        : false
    );
    setGameList(newGames);
    setGenre(genre);
    setLoading(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSearch(event: any): void {
    const query = event.target.value;
    setSearchValue(query);
    setLoading(true);
    const newGames = backupList.filter((game) =>
      (game.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 &&
        (genre ? game.genre === genre : true)) ||
      genre === "Gênero"
        ? game.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        : false
    );
    setGameList(newGames);
    setLoading(false);
  }

  async function loadFavoriteList(): Promise<void> {
    try {
      const { docs } = await getDocs(collection(db, "favorite"));
      const data = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFavoriteList(data as IFavorite[]);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadList(): Promise<void> {
    try {
      const { data } = await api.get("/data", {
        timeout: 5000,
        headers: {
          "dev-email-address": "dev@email.com",
        },
      });
      setGameList(data);
      setBackupList(data);
    } catch (error) {
      const err = error as AxiosError;

      setError(true);
      setErrorMessage(
        "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde."
      );

      if (err.code === "ECONNABORTED") {
        setErrorMessage("O servidor demorou para responder, tente mais tarde.");
      }

      if (err.response) {
        const errors: Set<number> = new Set([
          500, 502, 503, 504, 507, 508, 509,
        ]);
        const status: number = err.response.status;

        if (errors.has(status)) {
          setErrorMessage(
            "O servidor falhou em responder, tente recarregar a página."
          );
        }
      }
    }

    setLoading(false);
  }

  function validateUser(game_id: number): void {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser: User = JSON.parse(user);
      addFavorite(game_id, parsedUser?.id);
    } else {
      alert("Você deve logar antes.");
      navigate("/auth");
    }
  }

  async function addFavorite(game_id: number, user_id: string) {
    try {
      await addDoc(collection(db, "favorite"), { game_id, user_id });
      loadFavoriteList();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container>
      <header>
        <div className="banner">
          <img src={banner} alt="banner" className="banner-image" />
        </div>
        <Filter>
          <div className="search-bar">
            <InputGroup className="mb-3 search-input">
              <InputGroup.Text className="search-icon">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                className="search-input"
                placeholder="Pesquise pelo nome do jogo"
                aria-label="Pesquise pelo nome do jogo"
                aria-describedby="basic-addon2"
                onChange={handleSearch}
              />
            </InputGroup>
          </div>
          <Form.Select
            aria-label="select-genre"
            className="select-genres"
            onChange={handleGenresChange}
          >
            <option>Gênero</option>
            {genresArray.map((g) => {
              return (
                <option key={g} value={g}>
                  {g}
                </option>
              );
            })}
          </Form.Select>
        </Filter>
      </header>
      <Content>
        {loading ? (
          <Error>
            <Spinner animation="border" variant="light" />
          </Error>
        ) : error ? (
          <Error>
            <h1>{errorMessage}</h1>
            <Image
              className="image-error"
              src={errorBanner}
              alt="Error"
              fluid
            />
          </Error>
        ) : (
          <List>
            {games?.map((game) => {
              return (
                <Card style={{ width: "18rem" }} className="card" key={game.id}>
                  <Card.Img
                    variant="top"
                    src={game.thumbnail}
                    className="card-image"
                  />
                  <Card.Body>
                    <div className="heart-icon">
                      <Heart
                        isClick={favorites.some(
                          (fav) => fav.game_id === game.id
                        )}
                        onClick={() =>
                          validateUser(
                            game.id,
                          )
                        }
                      />
                    </div>
                    <Card.Title className="card-title">{game.title}</Card.Title>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip">
                          <strong>{game.short_description}</strong>
                        </Tooltip>
                      }
                    >
                      <Card.Text className="card-description">
                        {game.short_description}
                      </Card.Text>
                    </OverlayTrigger>
                    <Card.Text className="genre">{game.genre}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="card-footer">
                    <nav>
                      <ul>
                        <li>
                          Ver mais
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                        </li>
                      </ul>
                    </nav>
                  </Card.Footer>
                </Card>
              );
            })}
          </List>
        )}
      </Content>
    </Container>
  );
};

export default Home;
