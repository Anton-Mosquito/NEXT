// src/features/registration/model/validators.ts
import type { PersonalData, AccountData, PreferencesData } from "./types";

type Errors<T> = Partial<Record<keyof T, string>>;

export function validatePersonal(data: PersonalData): Errors<PersonalData> {
  const errors: Errors<PersonalData> = {};
  if (!data.firstName.trim()) errors.firstName = "Ім'я обов'язкове";
  else if (data.firstName.length < 2) errors.firstName = "Мінімум 2 символи";
  if (!data.lastName.trim()) errors.lastName = "Прізвище обов'язкове";
  else if (data.lastName.length < 2) errors.lastName = "Мінімум 2 символи";
  if (!data.birthDate) errors.birthDate = "Вкажіть дату народження";
  else {
    const age =
      new Date().getFullYear() - new Date(data.birthDate).getFullYear();
    if (age < 13) errors.birthDate = "Мінімальний вік — 13 років";
    if (age > 120) errors.birthDate = "Невірна дата";
  }
  if (!data.phone.trim()) errors.phone = "Телефон обов'язковий";
  else if (!/^\+?[\d\s\-()]{10,15}$/.test(data.phone)) {
    errors.phone = "Невірний формат телефону";
  }
  return errors;
}

export function validateAccount(data: AccountData): Errors<AccountData> {
  const errors: Errors<AccountData> = {};
  if (!data.email.trim()) errors.email = "Email обов'язковий";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Невірний формат email";
  }
  if (!data.username.trim()) errors.username = "Username обов'язковий";
  else if (data.username.length < 3) errors.username = "Мінімум 3 символи";
  else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username = "Тільки літери, цифри та _";
  }
  if (!data.password) errors.password = "Пароль обов'язковий";
  else if (data.password.length < 8) errors.password = "Мінімум 8 символів";
  else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(data.password)) {
    errors.password = "Потрібна велика літера та цифра";
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Паролі не співпадають";
  }
  return errors;
}

export function validatePreferences(
  _data: PreferencesData,
): Errors<PreferencesData> {
  return {}; // Preferences не мають обов'язкових полів
}
