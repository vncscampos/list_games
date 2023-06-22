import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import banner from "../../assets/banner.png";
import api from "../../services/api";
import { Container, Content, List, Filter } from "./styles";
import data from "../../services/api.json";

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
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [games, setGameList] = useState<IGame[]>(data);

  const genresArray: { id: number; genre: string }[] = [
    { id: 0, genre: "Shooter" },
    { id: 1, genre: "MMOARPG" },
    { id: 2, genre: "ARPG" },
    { id: 3, genre: "Fighting" },
    { id: 4, genre: "Action RPG" },
    { id: 5, genre: "Battle Royale" },
    { id: 6, genre: "MMORPG" },
    { id: 7, genre: "MOBA" },
    { id: 8, genre: "Sports" },
    { id: 9, genre: "Racing" },
    { id: 10, genre: "Card Game" },
    { id: 11, genre: "Strategy" },
    { id: 12, genre: "MMO" },
    { id: 13, genre: "Social" },
    { id: 14, genre: "Fantasy" },
  ];

  useEffect(() => {
    // loadList();
  }, []);

  function loadingGenres() {
    const genres: string[] = games?.map((game) => game.genre) || [];
    const uniqueGenres: Set<string> = new Set(genres);
    // setGenres([...uniqueGenres]);
  }

  async function loadList() {
    await api
      .get("/data", {
        headers: {
          "dev-email-address": "dev@email.com",
        },
      })
      .then((res) => {
        setGameList(res.data);
        loadingGenres();
      })
      .catch((err) => {
        console.error(err);
      });
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
              />
            </InputGroup>
          </div>
          <Form.Select aria-label="select-genre" className="select-genres">
            <option>Gênero</option>
            {genresArray.map((g) => {
              return (
                <option key={g.id} value={g.id}>
                  {g.genre}
                </option>
              );
            })}
          </Form.Select>
        </Filter>
      </header>
      <Content>
        {loading ? (
          <>
            <Spinner animation="border" variant="light" />
          </>
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
