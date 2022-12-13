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
import styles from "./SignIn.module.scss";
import useAPI from "../../../hooks/useAPI";

const SignIn = (): JSX.Element => {
  const [data, setData] = React.useState({ email: "", password: "" });
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

  const handleChange = (key: keyof typeof data, value: string): void => {
    setData((old) => ({ ...old, [key]: value }));
  };

  return (
    <Container size="xs" className={styles["sign-in-container"]}>
      <Card
        flex={true}
        flexDirection="col"
        type="raised"
        padding={6}
        spacing={4}
      >
        <h1>Sign In</h1>
        <TextInput
          id="email"
          label="Email"
          type="email"
          onChange={(e): void => handleChange("email", e.target.value)}
        />
        <PasswordInput
          id="password"
          label="Password"
          revealMode="hold"
          onChange={(e): void => handleChange("password", e.target.value)}
        />
        <Spacer spacing={3} axis="y" />
        <Button
          id="sign-in-button"
          fullWidth={true}
          variant="outlined"
          submit={true}
          color="rgb(220, 220, 220)"
          loading={isLoading}
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </Card>
    </Container>
  );
};

export default SignIn;
