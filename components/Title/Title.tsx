import React from "react";
import { useTitle } from "../../hooks/useTitle";

interface TitleProps {
  title: string;
  children?: React.ReactNode;
}

const Title = ({ title, children }: TitleProps): JSX.Element => {
  const { setTitle } = useTitle();

  React.useEffect(() => setTitle(title), [title, setTitle]);

  return <>{children}</>;
};

export default Title;
