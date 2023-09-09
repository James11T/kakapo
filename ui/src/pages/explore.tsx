import usePageTitle from "../hooks/usePageTitle";
import IconInput from "../components/iconInput";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setExploreQuery } from "../reducers/uiReducer";

const ExplorePage = () => {
  usePageTitle("Explore");

  const exploreQuery = useAppSelector((state) => state.ui.exploreQuery);
  const dispatch = useAppDispatch();

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
        value={exploreQuery}
        onChange={(event) =>
          dispatch(setExploreQuery(event.currentTarget.value))
        }
      />
    </div>
  );
};

export default ExplorePage;
