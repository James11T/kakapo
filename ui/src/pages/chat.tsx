import { Link, useParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { Message, User } from "../types";
import Avatar from "../components/avatar";
import getNamePlaceholder from "../utils/name";
import cn from "../utils/cn";
import { ChevronLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import React from "react";

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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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
      "Hmmmmmmmmmm, hmmmmmm, dave the femboy, aaaauuuggggggggg yyyyy uuhhh",
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

  usePageTitle(`Chat with ${username}`);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="sticky top-16 z-20 flex items-center gap-2 border-b-[1px] bg-white p-2">
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
            <div className="chat-bubble max-w-[75%]">{message.content}</div>
            <div className="chat-footer opacity-50">Seen</div>
          </div>
        ))}
      </div>
      <div className="bg-white p-2">
        <form onSubmit={handleSendMessage}>
          <label htmlFor="chat-input" hidden></label>
          <div className="flex w-full gap-2">
            <input
              type="text"
              name="chat-input"
              id="chat-input"
              className="input input-bordered flex-grow"
              placeholder="Start typing here to send a message"
            />
            <button type="button" className="btn btn-primary">
              <PaperAirplaneIcon className="h-5 w-5" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
