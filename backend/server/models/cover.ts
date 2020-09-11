import {Schema, model, Types, Document} from "mongoose";

export interface cover_interface extends Document 
{
    image: Buffer
    bookId: Types.ObjectId
}

const cover_shema = new Schema(
{
    image: {type: Buffer},
    bookId: {type: Types.ObjectId, ref: "books", unique: true},
})

export const Covers = model<cover_interface>("covers", cover_shema);