import React from "react";
import useTheme from "../hooks/useTheme";
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
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface NavItemProps extends React.PropsWithChildren {
  href: string;
}

const NavItem = ({ href, children }: NavItemProps) => {
  return (
    <Link className="cursor-pointer hover:underline" to={href}>
      {children}
    </Link>
  );
};

const App = () => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useTheme();

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
        <div className="drawer-content px-4 md:ml-56">
          <Routes>
            <Route path="/preferences" element={<PreferencesPage />} />
          </Routes>
        </div>
        <div className="drawer-side !fixed bottom-0 top-16 h-auto">
          <label
            className="drawer-overlay"
            onClick={() => dispatch(closeSidebar())}
          ></label>
          <ul className="menu bg-base-100 text-base-content h-full w-56 gap-2 p-2">
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
              <NavItem href="/inbox">
                <InboxIcon className="h-6" />
                Inbox
                <div className="badge badge-error">+99</div>
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
