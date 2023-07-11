import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch, FaHeart } from "react-icons/fa";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
import Heart from "react-animated-heart";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Container, Content, List, Filter, Error } from "./styles";
import errorBanner from "../../assets/error.svg";
import api from "../../services/api";
import { db, auth } from "../../services/firebase";
import { signOut } from "firebase/auth";
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
  id?: string;
  user_id: string;
  game_id: number;
}

interface User {
  id: string;
  token: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [games, setGameList] = useState<IGame[]>([]);
  const [backupList, setBackupList] = useState<IGame[]>([]);
  const [favorites, setFavoriteList] = useState<IFavorite[]>([]);

  const [showFavorite, setShowFavorite] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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
  const ratingArray = ["Bem avaliados", "Mal avaliados"];

  useEffect(() => {
    loadUser();
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) loadFavoriteList();
  }, [user]);

  async function loadUser() {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsedUser: User = JSON.parse(localUser);
      setUser(parsedUser);
    }
  }

  function handleFilter(event?: any) {
    const typeFilter = event?.target.id;
    const value = event?.target.value;

    if (typeFilter === "search") setSearchValue(value);
    if (typeFilter === "genre") setGenre(value);
    if (!typeFilter) setShowFavorite(!showFavorite);
  }

  useEffect(() => {
    const newGameList = backupList.filter(
      (game) =>
        (showFavorite
          ? favorites.find((fav) => fav.game_id === game.id)
          : true) &&
        (searchValue
          ? game.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          : true) &&
        (genre ? game.genre === genre : true)
    );

    setGameList(newGameList);
  }, [genre, searchValue, showFavorite]);

  async function loadFavoriteList(): Promise<void> {
    try {
      const q = query(
        collection(db, "favorite"),
        where("user_id", "==", user?.id)
      );
      const { docs } = await getDocs(q);
      const data = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFavoriteList(data as IFavorite[]);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadList(): Promise<void> {
    setLoading(true);
    try {
      const { data } = await api.get("/data", {
        timeout: 5000,
        headers: {
          "dev-email-address": "dev@email.com",
        },
      });
      setError(false);
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
    if (!user) {
      alert("Você deve logar antes.");
      navigate("/auth");
      return;
    }
    addFavorite(game_id, user.id);
  }

  async function addFavorite(game_id: number, user_id: string) {
    try {
      const documentExists = checkExistingDocument(game_id, user_id);
      if (documentExists) {
        removeFavorite(game_id);
      } else {
        const { id } = await addDoc(collection(db, "favorite"), {
          game_id,
          user_id,
        });
        setFavoriteList([...favorites, { id, game_id, user_id }]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function removeFavorite(game_id: number) {
    try {
      const fav = favorites.find((f) => f.game_id === game_id);
      const updatedList = favorites.filter((f) => f.id !== fav?.id);
      setFavoriteList(updatedList);
      await deleteDoc(doc(db, "favorite", fav?.id || ""));
    } catch (err) {
      console.error(err);
    }
  }

  function checkExistingDocument(gameId: number, userId: string): boolean {
    return !!favorites.find(
      (f) => f.game_id === gameId && f.user_id === userId
    );
  }

  async function logout(): Promise<void> {
    try {
      setUser(undefined);
      localStorage.clear();
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary navbar" fixed="top">
          <Nav className="me-auto">
            {!user ? (
              <Nav.Link className="link" href="/auth">
                Login
              </Nav.Link>
            ) : (
              <Nav.Link className="link" href="/" onClick={logout}>
                Sair
              </Nav.Link>
            )}
          </Nav>
        </Navbar>
        <div className="banner">
          {/* <img src={banner} alt="banner" className="banner-image" /> */}
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
                  onChange={handleFilter}
                  id="search"
                />
              </InputGroup>
            </div>
            <div className="filters">
              <div className="selects">
                <Form.Select
                  aria-label="select-genre"
                  className="select-genres"
                  onChange={handleFilter}
                  id="genre"
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
                <Form.Select
                  aria-label="select-rating"
                  className="select-genres"
                  onChange={handleFilter}
                >
                  <option>Avaliação</option>
                  {ratingArray.map((r) => {
                    return (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
              <Button
                className="favorite-button"
                variant="dark"
                style={{
                  backgroundColor: showFavorite ? "Violet" : "transparent",
                  color: showFavorite ? "white" : "Violet",
                }}
                onClick={handleFilter}
              >
                <FaHeart />
                Favoritos
              </Button>
            </div>
          </Filter>
        </div>
      </header>
      <Content>
        {loading ? (
          <Error>
            <Spinner animation="border" variant="light" />
          </Error>
        ) : error ? (
          <Error>
            <h1>
              {errorMessage}{" "}
              <span className="refresh" onClick={() => loadList()}>
                Tentar de novo
              </span>
            </h1>
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
                        onClick={() => validateUser(game.id)}
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
