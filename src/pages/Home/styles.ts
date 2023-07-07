import styled from "styled-components";

export const Container = styled.div`
  .banner-image {
    width: 100%;
    min-height: 5rem;
    max-height: 450px;
  }
`;

export const Filter = styled.div`
  margin: -20px 10% 0 10%;

  display: grid;
  grid-template-columns: 8fr 4fr;
  justify-items: center;
  gap: 1rem;

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
    width: 100%;
    background: #45456c;
    border-radius: 4px;
    border: none;
    color: #d1d1d1;
    font-weight: 700;
    height: 2.25rem;

    &:focus {
      border-color: #8925B1;
      box-shadow: inset 0 1px 1px rgba(93, 52, 123, 0.5),
        0 0 12px rgba(137, 37, 177, 1);
    }
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

  @media (max-width: 890px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 590px) {
    grid-template-columns: 1fr;
  }

  .card {
    margin-bottom: 1.5rem;
    border: none;
    border-radius: 8px;
    background: #45456c;
    color: #d1d1d1;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;

    .card-title {
      font-weight: 700;
    }

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(137, 37, 177, 0.75);
      transition: opacity 0.15s ease-in;
      opacity: 0;
      padding-top: 80px;
      color: #fff;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15);
      text-align: center;
    }

    :hover .cover {
      opacity: 1;
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
`;
