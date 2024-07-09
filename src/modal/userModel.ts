import { profile } from "console";
import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    role: {
        type:mongoose.Types.ObjectId,
        ref:"Role",
        required:true
    },
    profilePhoto: {
        type:String,
        required:true
        
    },
    isBlock: {
      type:Boolean,
      default:false
    }

    
  },{timestamps: true}
);


type User = InferSchemaType<typeof userSchema>;

const userModel = model<User>("User", userSchema);

export { userModel as User };
