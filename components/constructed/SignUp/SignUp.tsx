import React from "react";
import {
  Button,
  Card,
  Container,
  PasswordInput,
  TextInput,
  Spacer
} from "../../generic";
import useToasts from "../../../hooks/useToasts";
import styles from "./SignUp.module.scss";
import useAPI from "../../../hooks/useAPI";

const SignUp = (): JSX.Element => {
  const [data, setData] = React.useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const toasts = useToasts();
  const API = useAPI();

  const handleSignUp = async (): Promise<void> => {
    setIsLoading(true);
    const res = await API.createUser(data.username, data.email, data.password);
    setIsLoading(false);

    if (res.err) {
      if (res.http) {
        toasts.create(res.details?.error ?? res.text(), {
          color: "_destructive"
        });
      } else {
        toasts.create(res.text(), {
          color: "_destructive"
        });
      }
    } else {
      toasts.create(`Signed up as ${res.data.id}`, {
        color: "_success"
      });
    }
  };

  const handleChange = <T extends keyof typeof data>(
    key: T,
    value: typeof data[T]
  ): void => {
    setData((old) => ({ ...old, [key]: value }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleSignUp();
  };

  return (
    <Container size="xs" className={styles["sign-up-container"]}>
      <Card flex={true} flexDirection="col" type="raised" padding={6}>
        <h1>Sign Up</h1>
        <form action="" onSubmit={handleFormSubmit}>
          <TextInput
            id="email"
            label="Email"
            type="email"
            value={data.email}
            onChange={(e): void => handleChange("email", e.target.value)}
          />
          <TextInput
            id="username"
            label="Username"
            type="text"
            value={data.username}
            onChange={(e): void => handleChange("username", e.target.value)}
          />
          <PasswordInput
            id="password"
            label="Password"
            revealMode="hold"
            value={data.password}
            onChange={(e): void => handleChange("password", e.target.value)}
          />
          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            revealMode="hold"
            value={data.confirmPassword}
            onChange={(e): void =>
              handleChange("confirmPassword", e.target.value)
            }
          />
          <Spacer />
          <Button
            fullWidth={true}
            style="outlined"
            submit={true}
            loading={isLoading}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default SignUp;
