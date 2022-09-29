import TextInput from "../TextInput/TextInput";
import type { TextInputProps } from "../TextInput/TextInput";

const PasswordInput = (props: Omit<TextInputProps, "type">): JSX.Element => {
  return <TextInput {...props} type="password" />;
};

export default PasswordInput;
