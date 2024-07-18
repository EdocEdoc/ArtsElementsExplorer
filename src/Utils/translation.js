export const translate = (key, translation) => {
  if (!translation) {
    return key;
  }

  return translation[key] || key;
};
