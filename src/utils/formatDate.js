// src/utils/formatDate.js

export function formatPrettyDate(isoString) {
  const date = new Date(isoString);

  const months = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}


export function formatBirthday(isoString) {
  const date = new Date(isoString);

  const months = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export const getBirthdayStatus = (birthday) => {
  if (!birthday) return null;

  const today = new Date();
  const birthDate = new Date(birthday);

  if (Number.isNaN(birthDate.getTime())) return null;

  const birthdayThisYear = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  const diffMs = birthdayThisYear - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Bugun";
  if (diffDays === 1) return "Ertaga";
  if (diffDays > 1) return `${diffDays} kundan keyin`;

  return "Bu yil o‘tib ketgan";
};