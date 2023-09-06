import PreferenceSelect from "../components/preferenceSelect";
import PreferenceSwitch from "../components/preferenceSwitch";
import PreferenceDate from "../components/preferenceDate";
import GIFSearch from "../components/gifSearch";

const PreferencesPage = () => {
  return (
    <>
      <div className="mx-auto max-w-[1000px]">
        <div className="divider mt-1">PRIVACY</div>
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
        <div className="divider">DETAILS</div>
        <PreferenceSelect
          preference="sex"
          label="Sex"
          labelMap={{
            MALE: "Male",
            FEMALE: "Female",
            OTHER: "Other",
          }}
        />
        <PreferenceDate preference="dateOfBirth" label="Date of Birth" />
        <div className="divider">PREFERENCES</div>
        <PreferenceSelect
          preference="theme"
          label="Theme"
          labelMap={{
            automatic: "Automatic",
            light: "Light",
            dark: "Dark",
            luxury: "Gold",
          }}
        />
        <GIFSearch onSelect={(gif) => console.log(gif)} />
      </div>
    </>
  );
};

export default PreferencesPage;