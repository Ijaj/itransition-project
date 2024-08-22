export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function pathToName(inputString = "") {
  return inputString
    .replace("/", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .split(":")[0];
}

export function hasChildren(item) {
  const { children } = item;

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }

  return true;
}

export function truncateText(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export function setSearchLayout(layout) {
  sessionStorage.setItem('search_layout', layout);
}

export function getSearchLayout() {
  return sessionStorage.getItem('search_layout');
}

export function setSearchIPP(ipp) {
  sessionStorage.setItem('search_ipp', ipp);
}

export function getSearchIPP() {
  return sessionStorage.getItem('search_ipp');
}

export function setSearchFilter(filter) {
  sessionStorage.setItem('search_filter', filter);
}

export function getSearchFilter() {
  return Number.parseInt(sessionStorage.getItem('search_filter'));
}


