import {Schema, model, Document, Types} from 'mongoose';

interface page_interface extends Document
{
    chapterId: Types.ObjectId,
    bookId: Types.ObjectId,
    author: Types.ObjectId,
    content: Array<paragraph_interface>
}

interface paragraph_interface extends Document
{
    content: String
    text_align: String
    font_size: Number
}

const paragraph = new Schema(
{
    content: {type: String, default: ""},
    text_align: {type: String, default: "left"},
    font_size: {type: Number, default: 20}
}, 
{
    timestamps: true
})

const page_shema = new Schema(
{
    chapterId: {type: Types.ObjectId , required: true},
    author: {type: Types.ObjectId, required: true},
    content: [paragraph]
}, 
{
    timestamps: true
})
    

export const Pages = model<page_interface>('pages', page_shema)