const getNamePlaceholder = (name: string) => {
  const words = name.split(" ");
  const initials = words
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0));

  if (initials.length === 0) {
    return "UU";
  } else if (initials.length == 1) {
    return initials[0];
  } else {
    return initials[0] + initials[initials.length - 1];
  }
};

export default getNamePlaceholder;
