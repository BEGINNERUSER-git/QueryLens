import { query } from "express-validator";
import mongoose ,{Schema} from "mongoose";
const querySchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    queryText:{
        type:String,
        required:true

    },
     result:{
        type:Array,
        required:true
     },
      rawResult:{
        type:Array,
        required:true
     },
  date:{ type: Date, default:Date.now() }


},
// {collation:"queries"}
);

export const queryHistory=new mongoose.model('query',querySchema);