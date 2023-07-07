import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { FaInfo } from "react-icons/fa";

import { Container, BannerColumn, FormColumn } from "./styles";
import { auth } from "../../services/firebase";
import { InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

type FormData = {
  email: string;
  password: string;
};

const Auth = () => {
  const navigate = useNavigate();
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [messageError, setMessageError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>();

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>A senha deve conter no mínimo 6 caracteres.</strong>
    </Tooltip>
  );

  function onSubmit(
    data: FormData,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    e.preventDefault();
    if (isCreateAccount) {
      createUser(data);
    } else {
      signInUser(data);
    }
  }

  async function createUser({ email, password }: FormData): Promise<void> {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessageError("");
      setIsCreateAccount(false);
    } catch (err) {
      setMessageError("Falha ao criar usuário. Tente novamente.");
    }
  }

  async function signInUser({ email, password }: FormData): Promise<void> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const token = await user.getIdToken();
      localStorage.setItem("accessKey", token);
      setMessageError("");
      navigate("/");
    } catch (err) {
      setMessageError("Falha ao logar. Tente novamente.");
    }
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
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              className="input-form"
              type="email"
              placeholder="Digite seu e-mail"
              {...register("email", { required: true })}
            />
          </Form.Group>

          <Form.Label>Senha</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              className="input-form"
              type="password"
              placeholder="Digite sua senha"
              {...register("password", { required: true, minLength: 6 })}
            />
            <InputGroup.Text className="info-icon">
              <OverlayTrigger placement="bottom" overlay={tooltip}>
                <span>
                  <FaInfo />
                </span>
              </OverlayTrigger>
            </InputGroup.Text>
          </InputGroup>

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
                  onClick={(event) =>
                    handleSubmit((data) => onSubmit(data, event))(event)
                  }
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
                  onClick={(event) =>
                    handleSubmit((data) => onSubmit(data, event))(event)
                  }
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
