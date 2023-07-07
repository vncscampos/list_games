import styled from "styled-components";
import landing from "../../assets/full_landing.png";

export const BannerColumn = styled.div`
  background-image: url(${landing});
  min-height: 100%;
  width: 100%;
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #4b4b4b !important;

  .box {
    background: white;
    padding: 5rem 1rem;
    width: 80%;
    border-radius: 8px;


    .header {
      h1 {
        font-weight: 700;
      }

      margin-bottom: 2rem;
    }
  }

  .error-message {
    color: #B1252D;
    font-weight: 400;
    text-align: center !important;
  }

  .input-form {
    background: #45456c;
    border-radius: 4px;
    border: none;
    color: #d1d1d1;
    font-weight: 500;
    margin-bottom: 1rem;

    &::placeholder {
      color: #d1d1d1;
    }

    &:focus {
      border-color: #5d347b;
      box-shadow: inset 0 1px 1px rgba(93, 52, 123, 0.5),
        0 0 12px rgba(137, 37, 177, 1);
    }
  }

  .info-icon {
    background-color: #45456c;
    border: none;
    color: #d1d1d1;
    height: 2.25rem;
  }

  .footer-form {
    display: flex;
    justify-content: space-between;

    .text {
      color: #8925B1;
      cursor: pointer;
      font-weight: 700;
    }

    .submit-button {
      border-radius: 4px;
      border: none;
      color: #d1d1d1;
      font-weight: 700;
      background: #2f2e41;
    }
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  height: 100vh;

  border: none;
  margin: 0;

  @media (max-width: 800px) {
    background-image: url(${landing});
    grid-template-columns: 1fr;

    ${BannerColumn} {
      display: none;
    }
  }
`;
