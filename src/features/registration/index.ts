// src/features/registration/index.ts
export { registrationSlice, submitRegistration, resetForm, updateStepData,
  goToNextStep, goToPrevStep, goToStep, selectRegistration,
  selectCurrentStep, selectCanSubmit,
} from './model/registrationSlice'
export { RegistrationForm } from './ui/RegistrationForm'