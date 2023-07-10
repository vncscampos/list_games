import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const cache = setupCache({
    maxAge: 15 * 60 * 1000, // Tempo máximo de cache em milissegundos (aqui definido como 15 minutos)
  });

const api = axios.create({
    baseURL: 'https://games-test-api-81e9fb0d564a.herokuapp.com/api/',
    cache: cache
});

export default api;