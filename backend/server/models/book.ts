import { Schema, model, Types, Document } from 'mongoose';
import { user_interface } from './user';

export interface book_interface extends Document
{
    title: string
    synopsis: string
    views: number
    cover: string,
    tags: string,
    genres: Array<any>,
    published: boolean,
    author : Types.ObjectId | any
}

const book_schema = new Schema(
{   
    title: { type: String, maxlength: 512 },
    synopsis: { type: String, maxlength: 8162 },
    views: { type: Number, default: 0, min: 0},
    likes: { type: Number, default: 0, min: 0},
    published: {type:Boolean, default: false}, 
    cover: {type: String},
    genres: Array,
    tags: {type: String},
    author: {type: Types.ObjectId, ref: "Users"}
},
{
    timestamps: true
})


export const Books = model<book_interface>('books', book_schema);