import usePageTitle from "../hooks/usePageTitle";
import IconInput from "../components/iconInput";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const ExplorePage = () => {
  usePageTitle("Explore");

  return (
    <div className="pt-1">
      <label htmlFor="explore-search" hidden>
        Search
      </label>
      <IconInput
        type="text"
        name="explore-search"
        id="explore-search"
        className="input input-bordered w-full"
        placeholder="Search"
        icon={<MagnifyingGlassIcon />}
      />
    </div>
  );
};

export default ExplorePage;
