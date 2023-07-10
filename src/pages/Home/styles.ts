import styled from "styled-components";
import banner from "../../assets/banner.png";

export const Container = styled.div`
  .banner {
    background-image: url(${banner});
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 400px;
    min-height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .navbar {
    background: #45456c !important;
    padding: 0.5rem 5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    .link {
      color: #d1d1d1 !important;
      font-weight: 700;
      font-size: 12pt !important;
    }
  }
`;

export const Filter = styled.div`
  background: #1f2334;
  padding: 1rem;
  min-width: 50%;
  border-radius: 8px;

  .filters {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .selects {
    display: flex;
  }

  .search-bar {
    width: 100%;
    .search-icon {
      background-color: #45456c;
      border: none;
      color: #d1d1d1;
    }

    .search-input {
      background: #45456c;
      border-radius: 4px;
      border: none;
      color: #d1d1d1;
      font-weight: 700;

      &::placeholder {
        color: #d1d1d1;
      }

      &:focus {
        border-color: #5d347b;
        box-shadow: inset 0 1px 1px rgba(93, 52, 123, 0.5),
          0 0 12px rgba(137, 37, 177, 1);
      }
    }

    .search-bar {
      height: 2.5rem;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
  }

  .select-genres {
    background: #45456c;
    border-radius: 4px;
    border: none;
    color: #d1d1d1;
    font-weight: 700;
    height: 2.25rem;
    margin-right: 1rem;

    &:focus {
      border-color: #8925b1;
      box-shadow: inset 0 1px 1px rgba(93, 52, 123, 0.5),
        0 0 12px rgba(137, 37, 177, 1);
    }
  }

  .favorite-button {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-weight: 700;
    --c: Violet;
    color: var(--c);
    border: 0.1em solid var(--c);
    border-radius: 0.5em;
  }
`;

export const Content = styled.div`
  width: 100%;
  margin: 3rem 0 3rem 0;
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  padding: 0 5rem;

  @media (max-width: 1420px) {
    .card {
      max-width: 350px;
    }
  }

  @media (max-width: 1300px) {
    .card {
      max-width: 300px;
    }
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;

    .card {
      max-width: 400px;
    }
  }

  @media (max-width: 1000px) {
    .card {
      max-width: 350px;
    }
  }

  @media (max-width: 900px) {
    .card {
      max-width: 300px;
    }
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    .card {
      max-width: 400px;
    }
  }

  @media (max-width: 800px) {
    padding: 0;
    .card {
      max-width: 300px;
    }
  }

  .card {
    margin-bottom: 1.5rem;
    border: none;
    border-radius: 8px;
    background: #45456c;
    color: #d1d1d1;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    width: 400px !important;

    display: flex;
    justify-content: space-between;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;

    .card-title {
      font-weight: bold;
      max-width: 220px;
    }

    .heart-icon {
      right: 0;
      top: 0;
      margin-top: 50%;
      position: absolute;
    }

    .card-description {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .genre {
      font-size: 9pt;
      display: inline-block;
      background: #2f2e41;
      border-radius: 12px;
      padding: 0.2rem 0.5rem;
    }

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(137, 37, 177, 0.75);
      transition: opacity 0.15s ease-in;
      padding-top: 80px;
      color: #fff;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
      text-align: center;
    }

    .card-footer {
      display: flex;
      justify-content: center;
      border: none;
      padding-bottom: 1rem;

      nav ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        cursor: pointer;
      }

      nav ul li {
        --c: Violet;
        color: var(--c);
        font-size: 16px;
        border: 0.3em solid var(--c);
        border-radius: 0.5em;
        width: 12em;
        height: 3em;
        text-transform: uppercase;
        font-weight: bold;
        font-family: sans-serif;
        letter-spacing: 0.1em;
        text-align: center;
        line-height: 3em;
        position: relative;
        overflow: hidden;
        z-index: 1;
        transition: 0.5s;
        margin: 1em;
      }

      nav ul li span {
        position: absolute;
        width: 25%;
        height: 100%;
        background-color: var(--c);
        transform: translateY(150%);
        border-radius: 50%;
        left: calc((var(--n) - 1) * 25%);
        transition: 0.5s;
        transition-delay: calc((var(--n) - 1) * 0.1s);
        z-index: -1;
      }

      nav ul li:hover {
        color: white;
      }

      nav ul li:hover span {
        transform: translateY(0) scale(2);
      }

      nav ul li span:nth-child(1) {
        --n: 1;
      }

      nav ul li span:nth-child(2) {
        --n: 2;
      }

      nav ul li span:nth-child(3) {
        --n: 3;
      }

      nav ul li span:nth-child(4) {
        --n: 4;
      }
    }
  }
`;

export const Error = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 10% 0 10%;

  h1 {
    color: #d1d1d1;
    font-weight: 700;
    font-size: 12pt;
    margin-bottom: 5rem;
    text-align: center;
  }

  .image-error {
    width: 100%;
    min-height: 5rem;
    max-width: 600px;
  }

  .refresh {
    color: Violet;
    cursor: pointer;
  }
`;
