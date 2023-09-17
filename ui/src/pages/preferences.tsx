import PreferenceSelect from "../components/preferenceSelect";
import PreferenceSwitch from "../components/preferenceSwitch";
import PreferenceDate from "../components/preferenceDate";
import usePageTitle from "../hooks/usePageTitle";

const PreferencesPage = () => {
  usePageTitle("Preferences");

  return (
    <div className="mx-auto max-w-[1000px] px-2">
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
    </div>
  );
};

export default PreferencesPage;
