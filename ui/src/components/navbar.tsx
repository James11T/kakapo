import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { toggleSidebar } from "../reducers/uiReducer";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import cn from "../utils/cn";
import Avatar from "./avatar";
import getNamePlaceholder from "../utils/name";

const Navbar = () => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const user = useAppSelector((state) => state.user.value) ?? {
    uuid: "a",
    username: "jane.doe1",
    displayName: "Jane Doe",
    about: "",
    registeredAt: new Date(),
  };
  const dispatch = useAppDispatch();

  return (
    <div className="navbar bg-base-100 fixed top-0 z-50">
      <div className="flex-none md:hidden">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => dispatch(toggleSidebar())}
        >
          <div className={cn("swap swap-rotate", sidebarOpen && "swap-active")}>
            <Bars3Icon className="swap-off inline-block h-5 w-5 stroke-current" />
            <XMarkIcon className="swap-on inline-block h-5 w-5 stroke-current" />
          </div>
        </button>
      </div>
      <Link className="ml-2 flex-1 space-x-2" to="/">
        <img src={logo} alt="Kakapo Logo" className="h-8 w-8" />
        <span className="text-2xl normal-case">Kakapo</span>
      </Link>
      {user && (
        <Avatar
          icon={user.avatar}
          placeholder={getNamePlaceholder(user.displayName)}
          size="sm"
        />
      )}
    </div>
  );
};

export default Navbar;
