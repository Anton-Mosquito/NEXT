// src/features/registration/model/registrationSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  RegistrationState,
  PersonalData,
  AccountData,
  PreferencesData,
  StepId,
} from "./types";
import {
  validatePersonal,
  validateAccount,
  validatePreferences,
} from "./validators";
import type { RootState } from "@/app/store";

const initialState: RegistrationState = {
  currentStep: 0,
  maxVisitedStep: 0,
  steps: {
    personal: {
      data: { firstName: "", lastName: "", birthDate: "", phone: "" },
      errors: {},
      isValid: false,
      touched: false,
    },
    account: {
      data: { email: "", username: "", password: "", confirmPassword: "" },
      errors: {},
      isValid: false,
      touched: false,
    },
    preferences: {
      data: {
        newsletter: false,
        theme: "system",
        language: "uk",
        notifications: { email: true, push: false },
      },
      errors: {},
      isValid: true,
      touched: false,
    },
  },
  isSubmitting: false,
  submitResult: null,
};

// ✅ Async thunk для сабміту
export const submitRegistration = createAsyncThunk(
  "registration/submit",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { steps } = state.registration;

    const payload = {
      ...steps.personal.data,
      ...steps.account.data,
      ...steps.preferences.data,
    };

    // Симуляція API запиту
    await new Promise((r) => setTimeout(r, 1200));

    // Симуляція: email вже зайнятий
    if (steps.account.data.email === "taken@example.com") {
      return rejectWithValue("Цей email вже використовується");
    }

    return { userId: Math.floor(Math.random() * 10000), ...payload };
  },
);

type StepData = {
  personal: PersonalData;
  account: AccountData;
  preferences: PreferencesData;
};

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    // ✅ Оновлення даних поточного кроку
    updateStepData: <T extends StepId>(
      state: RegistrationState,
      action: PayloadAction<{ step: T; data: Partial<StepData[T]> }>,
    ) => {
      const { step, data } = action.payload;
      state.steps[step].data = {
        ...state.steps[step].data,
        ...data,
      } as any;
      state.steps[step].touched = true;

      // Валідація в реальному часі
      const validators = {
        personal: validatePersonal,
        account: validateAccount,
        preferences: validatePreferences,
      };
      const errors = validators[step](state.steps[step].data as any);
      state.steps[step].errors = errors as any;
      state.steps[step].isValid = Object.keys(errors).length === 0;
    },

    // ✅ Перехід до наступного кроку
    goToNextStep: (state) => {
      const stepIds: StepId[] = ["personal", "account", "preferences"];
      const currentStepId = stepIds[state.currentStep];

      // Валідуємо поточний крок
      const validators = {
        personal: validatePersonal,
        account: validateAccount,
        preferences: validatePreferences,
      };
      const errors = validators[currentStepId](
        state.steps[currentStepId].data as any,
      );
      state.steps[currentStepId].errors = errors as any;
      state.steps[currentStepId].isValid = Object.keys(errors).length === 0;
      state.steps[currentStepId].touched = true;

      if (Object.keys(errors).length === 0) {
        state.currentStep = Math.min(state.currentStep + 1, stepIds.length - 1);
        state.maxVisitedStep = Math.max(
          state.maxVisitedStep,
          state.currentStep,
        );
      }
    },

    goToPrevStep: (state) => {
      state.currentStep = Math.max(state.currentStep - 1, 0);
    },

    // ✅ Non-linear navigation (тільки до відвіданих кроків)
    goToStep: (state, action: PayloadAction<number>) => {
      if (action.payload <= state.maxVisitedStep) {
        state.currentStep = action.payload;
      }
    },

    resetForm: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(submitRegistration.pending, (state) => {
        state.isSubmitting = true;
        state.submitResult = null;
      })
      .addCase(submitRegistration.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitResult = {
          success: true,
          message: `Акаунт створено! ID: ${action.payload.userId}`,
        };
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitResult = {
          success: false,
          message: (action.payload as string) ?? "Помилка реєстрації",
        };
      });
  },
});

export const {
  updateStepData,
  goToNextStep,
  goToPrevStep,
  goToStep,
  resetForm,
} = registrationSlice.actions;

// Selectors
export const selectRegistration = (state: RootState) => state.registration;
export const selectCurrentStep = (state: RootState) =>
  state.registration.currentStep;
export const selectStepData = (step: StepId) => (state: RootState) =>
  state.registration.steps[step];
export const selectCanSubmit = (state: RootState) =>
  Object.values(state.registration.steps).every((s) => s.isValid);
