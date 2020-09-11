import {Schema, model, Document, Types} from 'mongoose';

export interface chapter_interface extends Document
{
    name:string,
    author: Types.ObjectId,
    bookId: Types.ObjectId
    pages: any[]

}


const chapter_Schema = new Schema(
{
    name: {type: String, maxlength: 1024, required: true},
    author: {type: Types.ObjectId, required: true},
    bookId: {type: Types.ObjectId, required: true},
}, 
{
    timestamps: true
})

export const Chapters = model<chapter_interface>('chapters', chapter_Schema)