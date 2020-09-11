import { Schema, model, Document, Types } from 'mongoose';
interface follow_interface extends Document
{
    authorId: Types.ObjectId,
    users: Types.ObjectId[]
}

const user_follow_schema = new Schema(
{
    authorId: { type: Types.ObjectId, ref: "Users", unique: true},
    users: {type: [Types.ObjectId], ref: "Users", default: []}
})

export const User_follows = model<follow_interface>("user_follows", user_follow_schema)