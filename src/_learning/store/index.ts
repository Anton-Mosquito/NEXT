// src/app/store/index.ts
export { makeStore } from "./makeStore";
export type { AppStore, RootState, AppDispatch } from "./makeStore";
export { useAppDispatch, useAppSelector } from "./hooks";
export { useStore } from "react-redux";
