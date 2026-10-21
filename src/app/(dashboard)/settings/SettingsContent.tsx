"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { updatePassword, updateProfile, deleteAccount } from "@/entities/user";
import { Avatar } from "@/shared/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  updatePasswordSchema,
  updateProfileSchema,
  type UpdatePasswordInput,
  type UpdateProfileInput,
} from "@/shared/schemas";

export type SettingsProfile = {
  name: string;
  email: string;
  image: string | null;
  phone: string;
};

type SettingsContentProps = {
  profile: SettingsProfile;
};

type SettingsFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function SettingsField({ id, label, error, children }: SettingsFieldProps) {
  const errorId = `${id}-error`;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function SettingsContent({
  profile: initialProfile,
}: SettingsContentProps) {
  const { update: updateSession } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const [profile, setProfile] = useState(initialProfile);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialProfile.name,
      phone: initialProfile.phone,
    },
  });
  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      phone: initialProfile.phone,
    },
  });
  const setPasswordValue = passwordForm.setValue;

  useEffect(() => {
    setPasswordValue("phone", profile.phone);
  }, [profile.phone, setPasswordValue]);

  const handleProfileSubmit = profileForm.handleSubmit(async (data) => {
    try {
      await updateProfile(data);
      setProfile((current) => ({ ...current, ...data }));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update profile"));
      return;
    }

    try {
      await updateSession({ name: data.name });
    } catch (error: unknown) {
      toast.error(
        `Profile updated, but the session could not refresh: ${getErrorMessage(
          error,
          "unknown error",
        )}`,
      );
      return;
    }

    toast.success("Profile updated");
  });

  const handlePasswordSubmit = passwordForm.handleSubmit(async (data) => {
    try {
      await updatePassword(data);
      setProfile((current) => ({ ...current, phone: data.phone }));
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        phone: data.phone,
      });
      toast.success("Password updated");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update password"));
    }
  });

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete account"));
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, preferences, and account settings.
        </p>
      </header>

      <Tabs defaultValue="account" className="gap-5">
        <TabsList
          variant="line"
          aria-label="Settings sections"
          className="w-full justify-start gap-4 rounded-none border-b p-0"
        >
          <TabsTrigger
            value="account"
            className="h-11 flex-none rounded-none px-4 text-sm text-muted-foreground after:bg-primary data-active:font-semibold data-active:text-primary"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="h-11 flex-none rounded-none px-4 text-sm text-muted-foreground after:bg-primary data-active:font-semibold data-active:text-primary"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-0 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_14rem]">
                <div className="flex min-w-0 flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={profile.name || "User"}
                      src={profile.image}
                      size="lg"
                      className="size-16 text-xl"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {profile.name || "User"}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleProfileSubmit}
                    className="flex flex-col gap-5"
                    noValidate
                  >
                    <FieldGroup className="max-w-xl">
                      <SettingsField
                        id="display-name"
                        label="Display name"
                        error={profileForm.formState.errors.name?.message}
                      >
                        <Input
                          id="display-name"
                          autoComplete="name"
                          aria-invalid={Boolean(
                            profileForm.formState.errors.name,
                          )}
                          aria-describedby={
                            profileForm.formState.errors.name
                              ? "display-name-error"
                              : undefined
                          }
                          {...profileForm.register("name")}
                        />
                      </SettingsField>
                      <SettingsField
                        id="account-phone"
                        label="Phone Number"
                        error={profileForm.formState.errors.phone?.message}
                      >
                        <Input
                          id="account-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          aria-invalid={Boolean(
                            profileForm.formState.errors.phone,
                          )}
                          aria-describedby={
                            profileForm.formState.errors.phone
                              ? "account-phone-error"
                              : undefined
                          }
                          {...profileForm.register("phone")}
                        />
                      </SettingsField>
                    </FieldGroup>

                    <div>
                      <Button
                        type="submit"
                        disabled={profileForm.formState.isSubmitting}
                      >
                        {profileForm.formState.isSubmitting
                          ? "Updating..."
                          : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                </div>

                <aside className="flex flex-col gap-3">
                  <p className="text-sm font-medium">Your Profile Picture</p>
                  <div
                    aria-disabled="true"
                    className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background px-4 py-6 text-center text-muted-foreground"
                  >
                    <ImagePlus aria-hidden="true" className="size-6" />
                    <span className="text-sm font-medium">
                      Upload your photo
                    </span>
                    <span className="text-xs">
                      Cloudinary upload integration coming soon
                    </span>
                  </div>
                </aside>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Dark mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
                {mounted && (
                  <Switch
                    aria-label="Dark mode"
                    checked={resolvedTheme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-destructive">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-medium">Delete account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data. This cannot be
                    undone.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-5"
                noValidate
              >
                <FieldGroup className="max-w-xl">
                  <SettingsField
                    id="old-password"
                    label="Old Password"
                    error={
                      passwordForm.formState.errors.currentPassword?.message
                    }
                  >
                    <Input
                      id="old-password"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={Boolean(
                        passwordForm.formState.errors.currentPassword,
                      )}
                      aria-describedby={
                        passwordForm.formState.errors.currentPassword
                          ? "old-password-error"
                          : undefined
                      }
                      {...passwordForm.register("currentPassword")}
                    />
                  </SettingsField>
                  <SettingsField
                    id="new-password"
                    label="New Password"
                    error={passwordForm.formState.errors.newPassword?.message}
                  >
                    <Input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(
                        passwordForm.formState.errors.newPassword,
                      )}
                      aria-describedby={
                        passwordForm.formState.errors.newPassword
                          ? "new-password-error"
                          : undefined
                      }
                      {...passwordForm.register("newPassword")}
                    />
                  </SettingsField>
                  <SettingsField
                    id="retype-password"
                    label="Retype Password"
                    error={
                      passwordForm.formState.errors.confirmPassword?.message
                    }
                  >
                    <Input
                      id="retype-password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(
                        passwordForm.formState.errors.confirmPassword,
                      )}
                      aria-describedby={
                        passwordForm.formState.errors.confirmPassword
                          ? "retype-password-error"
                          : undefined
                      }
                      {...passwordForm.register("confirmPassword")}
                    />
                  </SettingsField>
                  <SettingsField
                    id="security-phone"
                    label="Phone Number"
                    error={passwordForm.formState.errors.phone?.message}
                  >
                    <Input
                      id="security-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={Boolean(
                        passwordForm.formState.errors.phone,
                      )}
                      aria-describedby={
                        passwordForm.formState.errors.phone
                          ? "security-phone-error"
                          : undefined
                      }
                      {...passwordForm.register("phone")}
                    />
                  </SettingsField>
                </FieldGroup>

                <div>
                  <Button
                    type="submit"
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting
                      ? "Updating..."
                      : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account, all financial accounts,
              categories, and transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
