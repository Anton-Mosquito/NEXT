// src/app/registration/page.tsx
import { RegistrationForm } from "@/features/registration";

export const metadata = { title: "Реєстрація | FSD App" };

export default function RegistrationPage() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">📝 Реєстрація</h1>
      <p className="text-gray-500 text-sm mb-5">
        Multi-step форма з Redux стейт менеджментом
      </p>
      <RegistrationForm />
    </div>
  );
}
