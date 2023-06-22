import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import banner from "../../assets/banner.png";
// import api from "../../services/api";
import { Container, Content, SearchBar, List } from "./styles";
import api from "../../services/api.json";

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
  const [loading, setloading] = useState(false);
  const [games, setGameList] = useState<IGame[]>(api);

  useEffect(() => {
    console.log(games);
    // loadList();
  }, []);

  async function loadList() {
    // await api
    //   .get("/data", {
    //     headers: {
    //       "dev-email-address": "dev@email.com",
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     setGameList(res.data);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }

  return (
    <Container>
      <header>
        <div className="banner">
          <img src={banner} alt="banner" />
        </div>
        <SearchBar>
          <InputGroup className="mb-3 search-bar">
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
        </SearchBar>
      </header>
      <Content>
        {loading ? (
          <>
            <Spinner animation="border" variant="light" />
          </>
        ) : (
          <List>
            {api.map((game) => {
              return (
                <Card style={{ width: "18rem" }} className="card">
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
