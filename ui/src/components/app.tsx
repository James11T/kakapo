import React from "react";
import useTheme from "../hooks/useTheme";
import HomePage from "../pages/home";
import ExplorePage from "../pages/explore";
import ChatListPage from "../pages/chatList";
import ChatPage from "../pages/chat";
import PreferencesPage from "../pages/preferences";
import Navbar from "./navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { closeSidebar } from "../reducers/uiReducer";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";

interface NavItemProps extends React.PropsWithChildren {
  href: string;
  notifications?: number;
}

const NavItem = ({ href, notifications, children }: NavItemProps) => {
  return (
    <Link className="cursor-pointer hover:underline" to={href}>
      {children}
      {notifications && (
        <div className="badge badge-error font-semibold">
          {notifications > 99 ? "99+" : notifications}
        </div>
      )}
    </Link>
  );
};

const App = () => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useTheme();
  useTitle();

  React.useEffect(() => {
    dispatch(closeSidebar());
  }, [dispatch, location]);

  return (
    <>
      <Navbar />
      <div className="h-16"></div>
      <div className="drawer md:drawer-open">
        <input
          id="sidebar"
          type="checkbox"
          className="drawer-toggle"
          readOnly
          checked={sidebarOpen}
        />
        <div className="drawer-content px-2 md:ml-80">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/chats" element={<ChatListPage />} />
            <Route path="/chat/:username" element={<ChatPage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
          </Routes>
        </div>
        <div className="drawer-side !fixed bottom-0 top-16 z-50 h-auto">
          <label
            className="drawer-overlay"
            onClick={() => dispatch(closeSidebar())}
          ></label>
          <ul className="menu bg-base-100 text-base-content h-full w-80 gap-2 p-2">
            <li>
              <NavItem href="/">
                <HomeIcon className="h-6" />
                Home
              </NavItem>
            </li>
            <li>
              <NavItem href="/explore">
                <MagnifyingGlassIcon className="h-6" />
                Explore
              </NavItem>
            </li>
            <li>
              <NavItem href="/chats" notifications={6}>
                <ChatBubbleLeftIcon className="h-6" />
                Chats
              </NavItem>
            </li>
            <li>
              <NavItem href="/inbox" notifications={5}>
                <InboxIcon className="h-6" />
                Inbox
              </NavItem>
            </li>
            <li className="mt-auto">
              <NavItem href="/preferences">
                <AdjustmentsHorizontalIcon className="h-6" />
                Preferences
              </NavItem>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default App;
