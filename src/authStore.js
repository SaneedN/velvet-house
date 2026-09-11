// Minimal client-side account list. This is a demo app with no backend,
// so "registering" just means saving name/email/password in localStorage
// and "logging in" means checking against that list.

const KEY = 'vh_users';

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function setUsers(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function findUser(email) {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || null;
}

export function addUser({ name, email, password }) {
  const users = getUsers();
  users.push({ name, email, password });
  setUsers(users);
}