/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch, FaHeart, FaTrashAlt } from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
import Heart from "react-animated-heart";
import StarRatings from "react-star-ratings";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { Container, Content, List, Filter, Error } from "./styles";
import errorBanner from "../../assets/error.svg";
import api from "../../services/api";
import { db, auth } from "../../services/firebase";
import {
  IGame,
  IFavorite,
  User,
  ListRatings,
  GameWithRate,
} from "../../interfaces/home";
import { calculateRating } from "../../utils/calculateRating";
import { sortList } from "../../utils/sortList";

const Home = () => {
  const navigate = useNavigate();
  const [backupList, setBackupList] = useState<GameWithRate[]>([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [favorites, setFavoriteList] = useState<IFavorite[]>([]);
  const [gamesWithRate, setGamesWithRate] = useState<GameWithRate[]>([]);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderRate, setOrderRate] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showFavorite, setShowFavorite] = useState(false);
  const [user, setUser] = useState<User>();

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
  }, []);

  useEffect(() => {
    if (user) loadFavoriteList();
  }, [user]);

  useEffect(() => {
    const newGameList = backupList.filter(
      (game) =>
        (showFavorite
          ? favorites.find((fav) => fav.game_id === game.id)
          : true) &&
        (searchValue
          ? game.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          : true) &&
        (genre && genre !== "Gênero" ? game.genre === genre : true)
    );

    let sortedList: GameWithRate[] = [];
    if (orderRate === "Mal avaliados")
      sortedList = sortList(newGameList, "asc");
    if (orderRate === "Bem avaliados")
      sortedList = sortList(newGameList, "desc");
    if (orderRate === "" || orderRate === "Avaliação") sortedList = newGameList;

    setGamesWithRate(sortedList);

    if (backupList.length > 0 && sortedList.length === 0) {
      setError(true);
      setErrorMessage("Não encontramos nenhum jogo.");
    }
  }, [genre, searchValue, showFavorite, orderRate, favorites]);

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

  function checkExistingDocument(gameId: number, userId: string): boolean {
    return !!favorites.find(
      (f) => f.game_id === gameId && f.user_id === userId
    );
  }

  function clearFilter(): void {
    setGenre("Gênero");
    setSearchValue("");
    setOrderRate("Avaliação");
    setShowFavorite(false);
  }

  function handleFilter(event?: any) {
    const typeFilter = event?.target.id;
    const value = event?.target.value;

    if (typeFilter === "search") setSearchValue(value);
    if (typeFilter === "genre") setGenre(value);
    if (typeFilter === "rate") setOrderRate(value);
    if (!typeFilter) setShowFavorite(!showFavorite);

    setError(false);
  }

  function handleRating(newRating: number, gameId: number): void {
    const updatedGameList = gamesWithRate.map((game) => {
      if (game.id === gameId) {
        game.rate.push(newRating);
        game.average =
          game.rate.reduce((accumulator, value) => accumulator + value, 0) /
          game.rate.length;
        updateGameRating(game);
      }
      return game;
    });
    setGamesWithRate(updatedGameList);
  }

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
      const ratings = (await loadRatings()) as ListRatings[];
      const { data } = await api.get("/data");

      setError(false);

      const listGames = await calculateRating(ratings, data as IGame[]);

      setGamesWithRate(listGames);
      setBackupList(listGames);
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

  async function loadUser() {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const parsedUser: User = JSON.parse(localUser);
      setUser(parsedUser);
    }
  }

  async function loadRatings(): Promise<ListRatings[] | undefined> {
    try {
      const { docs } = await getDocs(collection(db, "ratings"));
      const data = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return data as ListRatings[];
    } catch (err) {
      console.error(err);
    }
  }

  async function logout(): Promise<void> {
    try {
      setUser(undefined);
      localStorage.clear();
      await signOut(auth);
    } catch (err) {
      console.error(err);
      alert('Falha ao sair da conta. Tente novamente.')
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

  async function updateGameRating(game: GameWithRate) {
    try {
      const docRef = doc(db, "ratings", `${game.id}`);
      setDoc(docRef, { ratingsList: game.rate });
    } catch (err) {
      console.error(err);
    }
  }

  function validateUser(game_id: number, rating?: number): void {
    if (!user) {
      alert("Você deve logar antes.");
      navigate("/auth");
      return;
    }
    if (rating) handleRating(rating, game_id);
    else addFavorite(game_id, user.id);
  }

  return (
    <Container>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary navbar" fixed="top">
          <Nav className="ms-auto">
            {!user ? (
              <Nav.Link className="link" href="/auth">
                <FiLogIn className="nav-icon" />
                Login
              </Nav.Link>
            ) : (
              <Nav.Link className="link" onClick={logout}>
                <FiLogOut className="nav-icon" />
                Sair
              </Nav.Link>
            )}
          </Nav>
        </Navbar>
        <div className="banner">
          <Filter>
            <div className="search-bar">
              <InputGroup className="mb-3 search-input">
                <InputGroup.Text className="search-icon">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  className="search-input"
                  placeholder="Pesquise pelo nome do jogo"
                  onChange={handleFilter}
                  id="search"
                  value={searchValue}
                />
              </InputGroup>
            </div>

            <div className="filters">
              <div className="selects">
                <Form.Select
                  as="select"
                  className="select-genres"
                  onChange={handleFilter}
                  value={genre}
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
                  as="select"
                  className="select-genres"
                  onChange={handleFilter}
                  id="rate"
                  value={orderRate}
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
                <Button
                  className="favorite-button"
                  variant="dark"
                  style={{
                    backgroundColor: showFavorite ? "Violet" : "transparent",
                    color: showFavorite ? "white" : "Violet",
                  }}
                  onClick={handleFilter}
                  disabled={!user}
                >
                  <FaHeart />
                  Favoritos
                </Button>
              </div>

              <div className="clear-filter" onClick={clearFilter}>
                <FaTrashAlt />
                <span>Limpar filtros</span>
              </div>
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
              {errorMessage !== "Não encontramos nenhum jogo." ? (
                <span className="refresh" onClick={() => loadList()}>
                  Tentar de novo
                </span>
              ) : (
                ""
              )}
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
            {gamesWithRate?.map((game) => {
              return (
                <Card style={{ width: "18rem" }} className="card" key={game.id}>
                  <Card.Img
                    variant="top"
                    src={game.thumbnail}
                    className="card-image"
                  />
                  <Card.Body>
                    <Card.Title className="card-title">{game.title}</Card.Title>
                    <div className="heart-icon">
                      <Heart
                        isClick={favorites.some(
                          (fav) => fav.game_id === game.id
                        )}
                        onClick={() => validateUser(game.id)}
                      />
                    </div>
                    <StarRatings
                      rating={game.average || 0}
                      changeRating={(number) => validateUser(game.id, number)}
                      starRatedColor="yellow"
                      starHoverColor="khaki"
                      numberOfStars={4}
                      name="avaliação"
                      starDimension="1.2rem"
                      starSpacing=".1rem"
                    />
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
                    <Link
                      style={{ textDecoration: "none" }}
                      to={game.game_url}
                      target="_blank"
                    >
                      <nav>
                        <ul>
                          <li>
                            Visitar site
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </li>
                        </ul>
                      </nav>
                    </Link>
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
