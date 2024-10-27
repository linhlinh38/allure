import { z } from "zod";
import { GenderEnum, RoleEnum, StatusEnum } from "../../utils/enum";
import moment from "moment";

export const AccountCreateSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name cannot exceed 100 characters")
      .optional(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name cannot exceed 100 characters")
      .optional(),
    username: z
      .string()
      .min(1, "Username is required")
      .max(100, "Username cannot exceed 100 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .optional(),
    role: z.nativeEnum(RoleEnum).default(RoleEnum.CUSTOMER),
    gender: z.nativeEnum(GenderEnum).optional().default(GenderEnum.MALE),
    phone: z
      .string()
      .regex(/^[0-9]{10,15}$/, "Phone must be a string with 10 to 15 digits")
      .optional(),
    dob: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (moment(value, "YYYY-MM-DD").isValid() &&
            moment(value, "YYYY-MM-DD").isBefore(
              moment(new Date(), "YYYY-MM-DD")
            )),
        {
          message: "Date of birth must be a valid date (YYYY-MM-DD)",
        }
      )
      .optional(),
    avatar: z
      .string()
      .max(255, "Avatar cannot exceed 255 characters")
      .optional(),
    status: z.nativeEnum(StatusEnum).optional().default(StatusEnum.ACTIVE),
  }),
});

//Zod schema update (partial update)
export const AccountUpdateSchema = z.object({
  body: AccountCreateSchema.partial(),
});
