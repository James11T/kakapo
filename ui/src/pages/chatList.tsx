import usePageTitle from "../hooks/usePageTitle";
import InboxEntry from "../components/inboxEntry";
import { range } from "../utils/number";

const ChatListPage = () => {
  usePageTitle("Chats");

  return (
    <div>
      <h2 className="font-bold">Messages</h2>
      <div className="pt-2">
        {range({ max: 20 }).map((index) => (
          <InboxEntry
            key={index}
            username="john.smith1"
            name="John Smith"
            online={index % 3 == 0}
            messagePreview="Hi, I'm on Kakapo "
          />
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
