import { TopBar, FlexPusher } from "../../generic";
import Link from "next/link";
import useAPI from "../../../hooks/useAPI";
import styles from "./NavBar.module.scss";

const NavBar = (): JSX.Element => {
  const API = useAPI();

  return (
    <TopBar>
      <nav className={styles["navbar"]}>
        <ul>
          <li>
            <Link href="/">
              <a>
                <img
                  src="/banner.png"
                  alt="Kakapo Logo"
                  className={styles["navbar__logo"]}
                />
              </a>
            </Link>
          </li>
          <FlexPusher />
          {API.user && <li>{API.user.username}</li>}
        </ul>
      </nav>
    </TopBar>
  );
};

export default NavBar;
