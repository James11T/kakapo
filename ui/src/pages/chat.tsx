import { useParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const ChatPage = () => {
  const { username } = useParams();

  usePageTitle(`Chat with ${username}`);

  return <></>;
};

export default ChatPage;
