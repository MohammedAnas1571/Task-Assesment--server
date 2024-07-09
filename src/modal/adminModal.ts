import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
);


type Admin = InferSchemaType<typeof adminSchema>;

const adminModel = model<Admin>("Admin", adminSchema);

export { adminModel as Admin };
