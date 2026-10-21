import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsContent, { type SettingsProfile } from "./SettingsContent";

const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  updatePassword: vi.fn(),
  deleteAccount: vi.fn(),
  updateSession: vi.fn(),
  setTheme: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  updateProfile: mocks.updateProfile,
  updatePassword: mocks.updatePassword,
  deleteAccount: mocks.deleteAccount,
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ update: mocks.updateSession }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: mocks.setTheme }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

const profile: SettingsProfile = {
  name: "Taylor Reed",
  email: "taylor@example.com",
  image: null,
  phone: "+12025550123",
};

describe("SettingsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.updateProfile.mockResolvedValue(undefined);
    mocks.updatePassword.mockResolvedValue(undefined);
    mocks.updateSession.mockResolvedValue(undefined);
  });

  it("shows the account profile and preserves appearance and danger-zone settings", async () => {
    const user = userEvent.setup();
    render(<SettingsContent profile={profile} />);

    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("taylor@example.com")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.getByText("Upload your photo")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Dark mode" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
    await user.click(screen.getByRole("switch", { name: "Dark mode" }));
    expect(mocks.setTheme).toHaveBeenCalledWith("dark");

    await user.click(screen.getByRole("button", { name: "Delete account" }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete my account" }),
    ).toBeInTheDocument();
  });

  it("switches to a password form with masked inputs and a phone number", async () => {
    const user = userEvent.setup();
    render(<SettingsContent profile={profile} />);

    await user.click(screen.getByRole("tab", { name: "Security" }));

    expect(screen.getByLabelText("Old Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByLabelText("New Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByLabelText("Retype Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByLabelText("Phone Number")).toHaveValue(profile.phone);
    expect(
      screen.getByRole("button", { name: "Update Password" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Appearance")).not.toBeInTheDocument();
  });

  it("submits the account profile details", async () => {
    const user = userEvent.setup();
    render(<SettingsContent profile={profile} />);

    await user.clear(screen.getByLabelText("Display name"));
    await user.type(screen.getByLabelText("Display name"), "Taylor Morgan");
    await user.clear(screen.getByLabelText("Phone Number"));
    await user.type(screen.getByLabelText("Phone Number"), "+12025550124");
    await user.click(screen.getByRole("button", { name: "Update Profile" }));

    await waitFor(() => {
      expect(mocks.updateProfile).toHaveBeenCalledWith({
        name: "Taylor Morgan",
        phone: "+12025550124",
      });
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Profile updated");
    expect(mocks.updateSession).toHaveBeenCalledWith({ name: "Taylor Morgan" });
  });

  it("blocks mismatched passwords before submitting", async () => {
    const user = userEvent.setup();
    render(<SettingsContent profile={profile} />);
    await user.click(screen.getByRole("tab", { name: "Security" }));

    await user.type(screen.getByLabelText("Old Password"), "CurrentPass1");
    await user.type(screen.getByLabelText("New Password"), "NewPassword2");
    await user.type(screen.getByLabelText("Retype Password"), "DifferentPass3");
    await user.click(screen.getByRole("button", { name: "Update Password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Passwords do not match",
    );
    expect(mocks.updatePassword).not.toHaveBeenCalled();
  });

  it("submits valid password changes with the security phone number", async () => {
    const user = userEvent.setup();
    render(<SettingsContent profile={profile} />);
    await user.click(screen.getByRole("tab", { name: "Security" }));

    await user.type(screen.getByLabelText("Old Password"), "CurrentPass1");
    await user.type(screen.getByLabelText("New Password"), "NewPassword2");
    await user.type(screen.getByLabelText("Retype Password"), "NewPassword2");
    await user.click(screen.getByRole("button", { name: "Update Password" }));

    await waitFor(() => {
      expect(mocks.updatePassword).toHaveBeenCalledWith({
        currentPassword: "CurrentPass1",
        newPassword: "NewPassword2",
        confirmPassword: "NewPassword2",
        phone: profile.phone,
      });
    });
    expect(mocks.toastSuccess).toHaveBeenCalledWith("Password updated");
  });
});
