// src/features/registration/model/types.ts
export interface PersonalData {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
}

export interface AccountData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface PreferencesData {
  newsletter: boolean;
  theme: "light" | "dark" | "system";
  language: "uk" | "en";
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export type StepId = "personal" | "account" | "preferences";

export interface StepState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
  touched: boolean;
}

export interface RegistrationState {
  currentStep: number;
  maxVisitedStep: number;
  steps: {
    personal: StepState<PersonalData>;
    account: StepState<AccountData>;
    preferences: StepState<PreferencesData>;
  };
  isSubmitting: boolean;
  submitResult: { success: boolean; message: string } | null;
}

export const STEPS: { id: StepId; label: string; icon: string }[] = [
  { id: "personal", label: "Особисті дані", icon: "👤" },
  { id: "account", label: "Акаунт", icon: "🔐" },
  { id: "preferences", label: "Налаштування", icon: "⚙️" },
];
