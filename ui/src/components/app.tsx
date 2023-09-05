import PreferenceSelect from "./preferenceSelect";
import PreferenceSwitch from "./preferenceSwitch";
import PreferenceDate from "./preferenceDate";

const App = () => {
  return (
    <div className="p-4">
      <PreferenceSwitch
        preference="accountPrivacy"
        label="Private Account"
        trueValue="PRIVATE"
        falseValue="PUBLIC"
      />
      <PreferenceSelect
        preference="messagePrivacy"
        label="Message Privacy"
        labelMap={{
          OPEN: "Open",
          FOLLOWED: "Following",
          FOLLOWERS: "Followers",
          MUTUALS: "Friends",
        }}
      />
      <PreferenceDate preference="dateOfBirth" label="Date of Birth" />
    </div>
  );
};

export default App;
