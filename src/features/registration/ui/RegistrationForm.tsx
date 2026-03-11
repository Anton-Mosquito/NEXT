// src/features/registration/ui/RegistrationForm.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  selectRegistration,
  selectCurrentStep,
  updateStepData,
  goToNextStep,
  goToPrevStep,
  goToStep,
  resetForm,
  submitRegistration,
  selectCanSubmit,
} from "../model/registrationSlice";
import { Button, Input, Card, Badge } from "@/shared/ui";
import { STEPS } from "../model/types";

// ============================================================
// Step Indicator
// ============================================================
function StepIndicator() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const { maxVisitedStep } = useAppSelector(selectRegistration);

  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isVisited = idx <= maxVisitedStep;
        const isClickable = idx <= maxVisitedStep && idx !== currentStep;

        return (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => isClickable && dispatch(goToStep(idx))}
              disabled={!isClickable}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full ${
                isCurrent
                  ? "bg-blue-500 text-white shadow"
                  : isCompleted
                    ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                    : isVisited
                      ? "bg-gray-100 text-gray-600 cursor-pointer"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
            >
              <span>{isCompleted ? "✅" : step.icon}</span>
              <span className="hidden sm:inline truncate">{step.label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-4 ${idx < currentStep ? "bg-green-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Step 0: Personal Data
// ============================================================
function PersonalStep() {
  const dispatch = useAppDispatch();
  const { data, errors, touched } =
    useAppSelector(selectRegistration).steps.personal;

  const update = (field: keyof typeof data, value: string) =>
    dispatch(updateStepData({ step: "personal", data: { [field]: value } }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ім'я *"
          value={data.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          error={touched ? errors.firstName : undefined}
          placeholder="Іван"
        />
        <Input
          label="Прізвище *"
          value={data.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          error={touched ? errors.lastName : undefined}
          placeholder="Петренко"
        />
      </div>
      <Input
        label="Дата народження *"
        type="date"
        value={data.birthDate}
        onChange={(e) => update("birthDate", e.target.value)}
        error={touched ? errors.birthDate : undefined}
      />
      <Input
        label="Телефон *"
        value={data.phone}
        onChange={(e) => update("phone", e.target.value)}
        error={touched ? errors.phone : undefined}
        placeholder="+380 99 123 4567"
      />
    </div>
  );
}

// ============================================================
// Step 1: Account Data
// ============================================================
function AccountStep() {
  const dispatch = useAppDispatch();
  const { data, errors, touched } =
    useAppSelector(selectRegistration).steps.account;

  const update = (field: keyof typeof data, value: string) =>
    dispatch(updateStepData({ step: "account", data: { [field]: value } }));

  const passwordStrength = (() => {
    const p = data.password;
    if (!p) return null;
    if (p.length < 6)
      return { label: "Слабкий", color: "bg-red-400", width: "25%" };
    if (p.length < 8 || !/[A-Z]/.test(p))
      return { label: "Середній", color: "bg-yellow-400", width: "50%" };
    if (!/[0-9]/.test(p))
      return { label: "Добрий", color: "bg-blue-400", width: "75%" };
    return { label: "Сильний", color: "bg-green-500", width: "100%" };
  })();

  return (
    <div className="space-y-4">
      <Input
        label="Email *"
        type="email"
        value={data.email}
        onChange={(e) => update("email", e.target.value)}
        error={touched ? errors.email : undefined}
        hint="Спробуй taken@example.com для демо помилки"
        placeholder="ivan@example.com"
      />
      <Input
        label="Username *"
        value={data.username}
        onChange={(e) => update("username", e.target.value)}
        error={touched ? errors.username : undefined}
        placeholder="ivan_petrenko"
      />
      <div className="space-y-1">
        <Input
          label="Пароль *"
          type="password"
          value={data.password}
          onChange={(e) => update("password", e.target.value)}
          error={touched ? errors.password : undefined}
          placeholder="Мінімум 8 символів"
        />
        {passwordStrength && (
          <div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                style={{ width: passwordStrength.width }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {passwordStrength.label}
            </p>
          </div>
        )}
      </div>
      <Input
        label="Підтвердити пароль *"
        type="password"
        value={data.confirmPassword}
        onChange={(e) => update("confirmPassword", e.target.value)}
        error={touched ? errors.confirmPassword : undefined}
      />
    </div>
  );
}

// ============================================================
// Step 2: Preferences
// ============================================================
function PreferencesStep() {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectRegistration).steps.preferences;

  const update = (partial: Partial<typeof data>) =>
    dispatch(updateStepData({ step: "preferences", data: partial }));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Тема
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["light", "dark", "system"] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => update({ theme })}
              className={`py-2 px-3 rounded-lg text-sm border-2 transition-all ${
                data.theme === theme
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {theme === "light"
                ? "☀️ Світла"
                : theme === "dark"
                  ? "🌙 Темна"
                  : "⚙️ Системна"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Мова
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["uk", "🇺🇦 Українська"],
              ["en", "🇬🇧 English"],
            ] as const
          ).map(([lang, label]) => (
            <button
              key={lang}
              onClick={() => update({ language: lang })}
              className={`py-2 px-3 rounded-lg text-sm border-2 transition-all ${
                data.language === lang
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Нотифікації</p>
        {[
          { key: "newsletter", label: "📧 Email розсилка" },
          { key: "notifications.email", label: "📬 Email нотифікації" },
          { key: "notifications.push", label: "🔔 Push нотифікації" },
        ].map(({ key, label }) => {
          const isChecked =
            key === "newsletter"
              ? data.newsletter
              : key === "notifications.email"
                ? data.notifications.email
                : data.notifications.push;

          const handleChange = () => {
            if (key === "newsletter") update({ newsletter: !data.newsletter });
            else if (key === "notifications.email")
              update({
                notifications: {
                  ...data.notifications,
                  email: !data.notifications.email,
                },
              });
            else
              update({
                notifications: {
                  ...data.notifications,
                  push: !data.notifications.push,
                },
              });
          };

          return (
            <label
              key={key}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-sm">{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Головна форма
// ============================================================
export function RegistrationForm() {
  const dispatch = useAppDispatch();
  const { currentStep, isSubmitting, submitResult } =
    useAppSelector(selectRegistration);
  const canSubmit = useAppSelector(selectCanSubmit);
  const isLastStep = currentStep === STEPS.length - 1;

  if (submitResult?.success) {
    return (
      <Card className="text-center py-10">
        <p className="text-5xl mb-3">🎉</p>
        <h2 className="text-2xl font-bold text-green-700 mb-2">Вітаємо!</h2>
        <p className="text-gray-600 mb-4">{submitResult.message}</p>
        <Button onClick={() => dispatch(resetForm())}>
          Зареєструвати ще один акаунт
        </Button>
      </Card>
    );
  }

  const stepComponents = [
    <PersonalStep />,
    <AccountStep />,
    <PreferencesStep />,
  ];

  return (
    <Card>
      <StepIndicator />

      <div className="min-h-64">{stepComponents[currentStep]}</div>

      {submitResult?.success === false && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ❌ {submitResult.message}
        </div>
      )}

      <div className="flex justify-between mt-6 pt-4 border-t">
        <Button
          variant="secondary"
          onClick={() => dispatch(goToPrevStep())}
          disabled={currentStep === 0}
        >
          ← Назад
        </Button>

        {isLastStep ? (
          <Button
            onClick={() => dispatch(submitRegistration())}
            isLoading={isSubmitting}
            disabled={!canSubmit}
          >
            ✅ Зареєструватись
          </Button>
        ) : (
          <Button onClick={() => dispatch(goToNextStep())}>Далі →</Button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        Крок {currentStep + 1} з {STEPS.length}
      </p>
    </Card>
  );
}
