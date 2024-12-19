import { z } from "zod";
import { AddressEnum } from "../../utils/enum";

export const AddressCreateSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .regex(/^[0-9]{10,15}$/, 'Phone must be a string with 10 to 15 digits'),
    notes: z.string().max(255).optional(),
    number: z.string().max(100).optional(),
    building: z.string().max(100).optional(),
    street: z.string().max(100).optional(),
    ward: z.string().max(100).optional(),
    city: z.string().max(100),
    province: z.string().max(255).optional(),
    fullAddress: z.string().max(100).optional(),
    type: z.nativeEnum(AddressEnum).default(AddressEnum.OTHER).optional(),
    account: z.string().optional(),
  }),
});

export const AddressUpdateSchema = z.object({
  body: AddressCreateSchema.partial(),
});
