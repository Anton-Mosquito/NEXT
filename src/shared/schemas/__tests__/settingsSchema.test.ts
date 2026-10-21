import { updatePasswordSchema, updateProfileSchema } from "../settingsSchema";

describe("settings schemas", () => {
  it("normalizes and validates profile details", () => {
    const result = updateProfileSchema.safeParse({
      name: " Taylor Reed ",
      phone: " +12025550123 ",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toEqual({
      name: "Taylor Reed",
      phone: "+12025550123",
    });
  });

  it("rejects invalid phone numbers", () => {
    const result = updateProfileSchema.safeParse({
      name: "Taylor Reed",
      phone: "not a phone number",
    });

    expect(result.success).toBe(false);
  });

  it("enforces password requirements and matching confirmation", () => {
    const result = updatePasswordSchema.safeParse({
      currentPassword: "CurrentPass1",
      newPassword: "newpassword",
      confirmPassword: "differentpassword",
      phone: "+12025550123",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues.map((issue) => issue.path[0])).toContain(
      "newPassword",
    );
    expect(result.error.issues.map((issue) => issue.path[0])).toContain(
      "confirmPassword",
    );
  });

  it("accepts matching passwords that meet the existing password policy", () => {
    const result = updatePasswordSchema.safeParse({
      currentPassword: "CurrentPass1",
      newPassword: "NewPassword2",
      confirmPassword: "NewPassword2",
      phone: "+12025550123",
    });

    expect(result.success).toBe(true);
  });
});
