// src/entities/user/ui/DbUserList.tsx
"use client";

import { useUsersQuery, useDeleteUserMutation } from "@/entities/user/api/userQueries";
import type { DbUser } from "@shared/schemas";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-6" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell />
        </TableRow>
      ))}
    </>
  );
}

function UserRow({ user }: { user: DbUser }) {
  const { mutate: deleteUser, isPending } = useDeleteUserMutation();

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{user.id}</TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {new Date(user.createdAt ?? Date.now()).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => deleteUser(user.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function DbUserList() {
  const { data: users, isLoading, isError, error } = useUsersQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Records fetched from PostgreSQL via a parameterized SELECT.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <SkeletonRows />}

            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-destructive">
                  {error instanceof Error ? error.message : "Failed to load users"}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  No users yet. Create the first one above!
                </TableCell>
              </TableRow>
            )}

            {users?.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
