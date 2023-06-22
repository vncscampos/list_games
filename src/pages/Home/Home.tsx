import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";

import banner from "../../assets/banner.png";
import errorBanner from "../../assets/error.svg";
import api from "../../services/api";
import { Container, Content, List, Filter, Error } from "./styles";

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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [games, setGameList] = useState<IGame[]>([]);
  const [backupList, setBackupList] = useState<IGame[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

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
    loadList();
  }, []);

  function handleGenresChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setGameList(backupList);

    if (event.target.value === "Gênero") return;

    setLoading(true);
    const newGames = backupList.filter(
      (game) => game.genre === event.target.value
    );
    setGameList(newGames);
    setLoading(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSearch(event: any) {
    const query = event.target.value;
    setLoading(true);
    const newGames = backupList.filter(
      (game) => game.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    setGameList(newGames);
    setLoading(false);
  }

  async function loadList() {
    try {
      const res = await api.get("/data", {
        timeout: 5000,
        headers: {
          "dev-email-address": "dev@email.com",
        },
      });
      setGameList(res.data);
      setBackupList(res.data);
    } catch (error) {
      const err = error as AxiosError;

      setError(true);
      setErrorMessage(
        "O servidor não conseguirá responder por agora, tente voltar novamente mais tarde."
      );

      console.log(err)
      
      if (err.code === "ECONNABORTED") {
        setErrorMessage("O servidor demorou para responder, tente mais tarde.");
      }

      if (err.response) {
        if (err.response.status >= 500) {
          setErrorMessage(
            "O servidor falhou em responder, tente recarregar a página."
          );
        }
      }
    }

    setLoading(false);
  }

  return (
    <Container>
      <header>
        <div className="banner">
          <img src={banner} alt="banner" />
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
                    <Card.Title className="card-title">{game.title}</Card.Title>
                    <Card.Text>{game.short_description}</Card.Text>
                    <Card.Text>
                      <b>Gênero:</b> {game.genre}
                    </Card.Text>
                    <Card.Text>
                      <b>Plataforma:</b> {game.platform}
                    </Card.Text>
                    <div className="cover">
                      <Card.Text>
                        <b>Desenvolvedores:</b> {game.developer}
                      </Card.Text>
                      <Card.Text>
                        <b>Estúdio:</b> {game.publisher}
                      </Card.Text>
                      <Card.Text>
                        <b>Lançamento: </b>
                        {game.release_date}
                      </Card.Text>
                    </div>
                  </Card.Body>
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
