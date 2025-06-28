import mongoose,{Schema} from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true ,unique:true},
  email:{ type: String, required: true ,unique:true },
  password:{ type: String, required: true },
  date:{ type: Date, default:Date.now() }
});

export const User=new mongoose.model('User',UserSchema);