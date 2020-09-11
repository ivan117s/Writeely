import { Schema, model, Document, Types } from 'mongoose';

export interface user_interface extends Document
{
    name: string 
    email: string
    password: string
    nickname: string 
    introduction: string,
    social_networks: object,
    avatar: string,
    followers: number,
    views:number
    likes: number,
    followed: any[],
}

const Social_networks_schema = new Schema(
{
    youtube: {type: String, maxlength: 512, default: ""},
    instagram: {type: String, maxlength: 512, default: ""},
    twitter: {type: String, maxlength: 512, default: ""},
    patreon: {type: String, maxlength: 512, default: ""}
})

const user_schema = new Schema(
{   
    name: { type: String, required: true, maxlength: 512 },
    email: { type: String, required: true,  unique: true, maxlength: 512,  lowercase: true, trim: true, },
    nickname: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 512 },
    introduction: { type: String, trim: true , maxlength: 2042 },
    password: { type: String, required: true },
    email_confirm: { type: Boolean, required: true, default: false } ,
    avatar: {type: String },
    recommended_books: {type: Types.ObjectId, ref: "books"},
    books: {type:Number, default: 0},
    followers: {type: Number, default: 0},
    likes:  {type: Types.ObjectId, ref: "books"},
    views: { type: Number, required: true , default: 0 },
    social_networks: {type: Social_networks_schema, default: 
    {
        youtube: "",
        instagram: "",
        twitter: "",
        patreon: ""
    }}
},
{
    timestamps: true
})


export const Users = model<user_interface>('Users', user_schema);