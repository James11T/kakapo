import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { toggleSidebar } from "../reducers/uiReducer";

const Navbar = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="navbar bg-base-100 fixed top-0 z-50 md:pl-6">
      <div className="flex-none md:hidden">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <Link className="flex-1" to="/">
        <img src={logo} alt="Kakapo Logo" className="h-8 w-8" />
        <span className="ml-2 text-2xl normal-case">Kakapo</span>
      </Link>
    </div>
  );
};

export default Navbar;
