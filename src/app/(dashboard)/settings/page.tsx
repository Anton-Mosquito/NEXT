"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfile, deleteAccount } from "@/entities/user/api/profileActions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, LabeledInput, Button, Spinner } from "@/shared/ui";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileFormData {
  name: string;
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: session?.user?.name || "",
    },
  });

  useEffect(() => {
    if (session?.user?.name) {
      setValue("name", session.user.name);
    }
  }, [session?.user?.name, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      await updateSession({ name: data.name });
      toast.success("Profile updated");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete account";
      toast.error(errorMessage);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your profile, preferences, and account settings.
        </p>
      </div>

      {/* Section 1: Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              name={session?.user?.name || "User"}
              src={session?.user?.image}
              size="lg"
              className="size-16 text-xl"
            />
            <div>
              <p className="font-semibold">{session?.user?.name || "User"}</p>
              <p className="text-muted-foreground text-sm">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
              <LabeledInput
                label="Display name"
                defaultValue={session?.user?.name || ""}
                {...register("name", {
                  required: "Display name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 50, message: "Name must be at most 50 characters" },
                })}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Section 2: Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark mode</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            {mounted && (
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Danger Zone */}
      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account, all financial accounts, categories, and transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Spinner /> : "Delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
