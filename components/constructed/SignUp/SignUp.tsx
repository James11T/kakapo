import {
  Button,
  Card,
  Container,
  PasswordInput,
  TextInput
} from "../../generic";
import styles from "./SignIn.module.scss";

const SignUp = (): JSX.Element => {
  return (
    <Container size="xs" className={styles["sign-in-container"]}>
      <Card
        flex={true}
        flexDirection="col"
        type="raised"
        padding={4}
        spacing={4}
      >
        <h1>Sign Up</h1>
        <TextInput id="email" label="Email" type="email" />
        <PasswordInput id="password" label="Password" />
        <PasswordInput id="repeated-password" label="Repeat Password" />
        <Button
          id="sign-up-button"
          fullWidth={true}
          variant="raised"
          submit={true}
          color="rgb(220, 220, 220)"
        >
          Sign In
        </Button>
      </Card>
    </Container>
  );
};

export default SignUp;
