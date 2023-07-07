import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";

import { Container, BannerColumn, FormColumn } from "./styles";
import landing from "../../assets/landing.png";

const Auth = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);

  return (
    <Container>
      <BannerColumn></BannerColumn>
      <FormColumn>
        <Form className="box">
          <h1>Bem vindo</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="input-form"
              type="email"
              placeholder="Digite seu email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              className="input-form"
              type="password"
              placeholder="Digite sua senha"
            />
          </Form.Group>

          <div className="footer-form">
            {isCreateAccount ? (
              <>
                <Form.Text onClick={() => setIsCreateAccount(false)} className="text-muted">Já possuo uma conta</Form.Text>

                <Button
                  className="submit-button"
                  variant="primary"
                  type="submit"
                >
                  Criar conta
                </Button>
              </>
            ) : (
              <>
                <Form.Text onClick={() => setIsCreateAccount(true)} className="text-muted">Criar uma conta</Form.Text>

                <Button
                  className="submit-button"
                  variant="primary"
                  type="submit"
                >
                  Entrar
                </Button>
              </>
            )}
          </div>
        </Form>
      </FormColumn>
    </Container>
  );
};

export default Auth;
