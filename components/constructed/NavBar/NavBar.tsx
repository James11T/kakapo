import { TopBar } from "../../generic";
import Link from "next/link";
import styles from "./NavBar.module.scss";

const NavBar = (): JSX.Element => {
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
        </ul>
      </nav>
    </TopBar>
  );
};

export default NavBar;
