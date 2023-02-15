import React from "react";
import {
  Button,
  Card,
  Container,
  PasswordInput,
  TextInput,
  Checkbox
} from "../../generic";
import useToasts from "../../../hooks/useToasts";
import styles from "./SignIn.module.scss";
import useAPI from "../../../hooks/useAPI";

const SignIn = (): JSX.Element => {
  const [data, setData] = React.useState({
    email: "",
    password: "",
    remember: false
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const toasts = useToasts();
  const API = useAPI();

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    const res = await API.authenticate(data.email, data.password);
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
      toasts.create(`Signed in as ${res.data.user.username}`, {
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
    handleSignIn();
  };

  return (
    <Container size="xs" className={styles["sign-in-container"]}>
      <Card flex="col" style="raised" padding={6}>
        <h1>Sign In</h1>
        <form action="" onSubmit={handleFormSubmit}>
          <TextInput
            id="email"
            label="Email"
            type="email"
            value={data.email}
            onChange={(e): void => handleChange("email", e.target.value)}
          />
          <PasswordInput
            id="password"
            label="Password"
            revealMode="hold"
            value={data.password}
            onChange={(e): void => handleChange("password", e.target.value)}
          />
          <Checkbox
            checked={data.remember}
            style="outlined"
            onChange={(e): void => handleChange("remember", e.target.checked)}
          >
            Stay signed in
          </Checkbox>
          <Button
            id="sign-in-button"
            fullWidth={true}
            style="outlined"
            submit={true}
            loading={isLoading}
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </Container>
  );
};

export default SignIn;
