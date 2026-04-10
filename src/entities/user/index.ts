export type { User } from "./model/types";
export { useGetUsersQuery, useGetUserByIdQuery, userApi } from "./api/userApi";
export { UserCard } from "./ui/UserCard";

// DB-backed (PostgreSQL / TanStack Query)
export {
  useUsersQuery,
  useUserByIdQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  userQueryKeys,
} from "./api/userQueries";
export { DbUserList } from "./ui/DbUserList";
