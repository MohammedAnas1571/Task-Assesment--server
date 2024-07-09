import  { InferSchemaType, Schema, model } from "mongoose";

const roleSchema = new Schema(
  {
    rolename: {
      type: String,
      required: true,
    
      
    },
    isBlock: {
        type:Boolean,
        default:false
     
    },
    
      isDelete: {
       type: Boolean,
      default:false
      }
    
  },{timestamps: true}
);


type Admin = InferSchemaType<typeof roleSchema>;

const roleModel = model<Admin>("Role", roleSchema);

export { roleModel as Role };
