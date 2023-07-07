import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";

import { Container, BannerColumn, FormColumn } from "./styles";

type FormData = {
  email: string;
  password: string;
};

const Auth = () => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [messageError, setMessageError] = useState(
    "Houve um erro na requisição"
  );
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
  } = useForm<FormData>();

  function onSubmit(data: FormData): void {
    console.log(data);
  }

  return (
    <Container>
      <BannerColumn></BannerColumn>
      <FormColumn>
        <Form className="box">
          <div className="header">
            <h1>Bem vindo</h1>
            <span>Preencha todos os campos abaixo!</span>
          </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="input-form"
              type="email"
              placeholder="Digite seu email"
              {...register("email", { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              className="input-form"
              type="password"
              placeholder="Digite sua senha"
              {...register("password", { required: true })}
            />
          </Form.Group>

          <div className="footer-form">
            {isCreateAccount ? (
              <>
                <Form.Text
                  onClick={() => setIsCreateAccount(false)}
                  className="text"
                >
                  Já possuo uma conta
                </Form.Text>

                <Button
                  className="submit-button"
                  variant="primary"
                  type="submit"
                  disabled={!isValid || !isDirty}
                  onClick={() => handleSubmit(onSubmit)()}
                >
                  Criar conta
                </Button>
              </>
            ) : (
              <>
                <Form.Text
                  onClick={() => setIsCreateAccount(true)}
                  className="text"
                >
                  Criar uma conta
                </Form.Text>

                <Button
                  className="submit-button"
                  disabled={!isValid || !isDirty}
                  variant="primary"
                  onClick={() => handleSubmit(onSubmit)()}
                >
                  Entrar
                </Button>
              </>
            )}
          </div>

          <Form.Text className="error-message">
            {messageError ? messageError : null}
          </Form.Text>
        </Form>
      </FormColumn>
    </Container>
  );
};

export default Auth;
