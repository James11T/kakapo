import GIFDialog from "../components/gifSearch";
import usePageTitle from "../hooks/usePageTitle";

const HomePage = () => {
  usePageTitle("Home");

  return (
    <>
      <GIFDialog onSelect={() => {}} />
    </>
  );
};

export default HomePage;
