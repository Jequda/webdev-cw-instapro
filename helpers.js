export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export function sanitizerHtml(string) {
  return string.replaceAll("<", "&lt")
    .replaceAll(">", "&gt")
    .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
    .replaceAll("QUOTE_END", "</div>")
}