import Cookies from 'js-cookie';

interface CookieItem {
  id: string;
  data: any;
}

const getCookieItems = (key: string): CookieItem[] => {
  const cookieValue = Cookies.get(key);
  return cookieValue ? JSON.parse(cookieValue) : null;
};

const setCookieItems = (key: string, items: CookieItem[]): void => {
  Cookies.set(key, JSON.stringify(items));
};

const createCookieItem = (key: string, data: any): any => {
  setCookieItems(key, data);
  return data;
};

const readCookieItems = (key: string): any => {
  return getCookieItems(key);
};

const updateCookieItem = (key: string, id: string, newData: any): void => {
  const items = getCookieItems(key);
  const updatedItems = items.map(item =>
    item.id === id ? { ...item, data: newData } : item
  );
  setCookieItems(key, updatedItems);
};

const deleteCookieItem = (key: string, id: string): void => {
  const items = getCookieItems(key);
  const updatedItems = items.filter(item => item.id !== id);
  setCookieItems(key, updatedItems);
};

const clearCookies = (key: string): void => {
  Cookies.remove(key);
};

export {
  createCookieItem,
  readCookieItems,
  updateCookieItem,
  deleteCookieItem,
  clearCookies,
};
