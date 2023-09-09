import { Link } from "react-router-dom";
import getNamePlaceholder from "../utils/name";
import Avatar from "./avatar";

interface InboxEntryProps {
  icon?: string;
  name: string;
  username: string;
  messagePreview?: string;
  online: boolean;
}

const InboxEntry = ({
  icon,
  name,
  username,
  messagePreview,
  online,
}: InboxEntryProps) => {
  return (
    <Link
      className="hover:bg-base-200 flex w-full space-x-2 rounded-md p-2 text-left"
      to={`/chat/${username}`}
    >
      <div className="flex flex-col justify-center">
        <Avatar
          icon={icon}
          placeholder={getNamePlaceholder(name)}
          online={online}
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-lg font-semibold">{name}</div>
        <div className="text-base-content text-opacity-75">
          {messagePreview}
        </div>
      </div>
    </Link>
  );
};

export default InboxEntry;
