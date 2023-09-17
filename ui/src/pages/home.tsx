import usePageTitle from "../hooks/usePageTitle";
import Post from "../components/post";
import { range } from "../utils/number";

const testPost = {
  uuid: "123",
  caption:
    "Boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ee-ma, Da-boom-da-da-mmm-dum-na-ayy, go!",
  postedAt: new Date(),
  processed: false,
  edited: false,
  liked: true,
  saved: true,
  author: {
    uuid: "123",
    username: "john.doe1",
    displayName: "John Doe",
    avatar: "./nopfp.jpg",
    about: "about me",
    registeredAt: new Date(),
  },
  media: range({ max: 10 }).map((index) => ({
    uuid: String(index),
    url: `https://picsum.photos/500?random=${index}`,
    type: "IMAGE",
    index: index,
    restricted: false,
    blocked: false,
  })),
  likeCount: 0,
  commentCount: 0,
};

const HomePage = () => {
  usePageTitle("Home");

  return (
    <div className="mx-auto max-w-[500px]">
      <Post post={testPost} />
    </div>
  );
};

export default HomePage;
