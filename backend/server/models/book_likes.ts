import { Schema, model, Document, Types } from 'mongoose';
interface book_like_interface extends Document
{
    bookId: Types.ObjectId,
    users: Types.ObjectId[]
}

const book_like_schema = new Schema(
{
    bookId:{ type: Types.ObjectId, ref: "books", unique: true},
    users: [{ type: Types.ObjectId, ref: "users"}]
})

export const Book_likes = model<book_like_interface>("book_likes", book_like_schema)