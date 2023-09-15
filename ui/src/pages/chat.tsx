import React from "react";
import { Link, useParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { Message, User } from "../types";
import Avatar from "../components/avatar";
import getNamePlaceholder from "../utils/name";
import cn from "../utils/cn";
import { ChevronLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { emojify } from "node-emoji";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setDraft } from "../reducers/chatReducer";
import useUser from "../hooks/useUser";

const messages: Message[] = [
  {
    author: {
      uuid: "a",
      username: "bob",
      about: "",
      registeredAt: new Date(),
      displayName: "Big Bob",
    },
    content:
      "message :egg: message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
  {
    author: {
      uuid: "a",
      username: "alice",
      about: "",
      registeredAt: new Date(),
      displayName: "Alice Gobbles",
    },
    content:
      "message message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
  {
    author: {
      uuid: "a",
      username: "alice",
      about: "",
      registeredAt: new Date(),
      displayName: "Alice Gobbles",
    },
    content:
      "message message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
  {
    author: {
      uuid: "a",
      username: "bob",
      about: "",
      registeredAt: new Date(),
      displayName: "Big Bob",
    },
    content:
      "message message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
  {
    author: {
      uuid: "a",
      username: "bob",
      about: "",
      registeredAt: new Date(),
      displayName: "Big Bob",
    },
    content:
      "message message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
  {
    author: {
      uuid: "a",
      username: "alice",
      about: "",
      registeredAt: new Date(),
      displayName: "Alice Gobbles",
    },
    content:
      "message message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
  {
    author: {
      uuid: "a",
      username: "bob",
      about: "",
      registeredAt: new Date(),
      displayName: "Big Bob",
    },
    content:
      "message message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
  {
    author: {
      uuid: "a",
      username: "bob",
      about: "",
      registeredAt: new Date(),
      displayName: "Big Bob",
    },
    content:
      "message message message message message message message message message message message message message message message message message ",
    sentAt: new Date(),
  },
];

const me: User = {
  uuid: "a",
  username: "bob",
  about: "",
  registeredAt: new Date(),
  displayName: "Big Bob",
};

const ChatPage = () => {
  const { username } = useParams();

  if (!username) {
    throw new Error("Chat page loaded without username");
  }

  const chatDrafts = useAppSelector((state) => state.chat.drafts);
  const dispatch = useAppDispatch();
  const userQuery = useUser({ username });

  usePageTitle(`Chat with ${username}`);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="bg-base-100 border-base-200 sticky top-16 z-20 flex items-center gap-2 border-b-[1px] p-2">
        <Link className="btn btn-ghost btn-square" to="/chats">
          <ChevronLeftIcon className="h-8 w-8" />
        </Link>
        <Avatar size="lg" placeholder={getNamePlaceholder(me.displayName)} />
        <div>
          <div className="text-2xl font-semibold">{me.displayName}</div>
          <div className="text-base-content text-opacity-75">
            Last seen 10m ago
          </div>
        </div>
      </div>
      <div className="p-2">
        {messages.map((message, index) => (
          <div
            className={cn(
              "chat",
              me.username === message.author.username
                ? " chat-end"
                : " chat-start"
            )}
            key={index}
          >
            <Avatar
              className="chat-image"
              size="sm"
              placeholder={getNamePlaceholder(message.author.displayName)}
              online={true}
            />
            <div className="chat-header space-x-1">
              <span>{message.author.displayName}</span>
              <time className="content-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble max-w-[75%] rounded-lg">
              {emojify(message.content)}
            </div>
            <div className="chat-footer opacity-50">Seen</div>
          </div>
        ))}
      </div>
      <div className="bg-base-100 p-2">
        <form onSubmit={handleSendMessage}>
          <label htmlFor="chat-input" hidden></label>
          <div className="flex w-full gap-2">
            <input
              type="text"
              name="chat-input"
              id="chat-input"
              className="input input-bordered flex-grow"
              placeholder="Start typing here to send a message"
              value={
                (userQuery.isSuccess && chatDrafts[userQuery.data.uuid]) || ""
              }
              onChange={(event) =>
                userQuery.isSuccess &&
                dispatch(
                  setDraft({
                    uuid: userQuery.data.uuid,
                    text: emojify(event.currentTarget.value),
                  })
                )
              }
            />
            <button
              type="button"
              className="btn btn-primary"
              disabled={userQuery.isLoading}
            >
              {userQuery.isLoading ? (
                <div className="loading loading-spinner h-5 w-5"></div>
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
