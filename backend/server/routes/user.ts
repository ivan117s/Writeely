import {Router} from 'express';
import {Users, user_interface} from '../models/user';
import {Books} from '../models/book';

import dotenv from 'dotenv';
import { User_follows } from '../models/user_follows';
import { Types } from 'mongoose';
import multer from '../multer';
import fs from 'fs'
import path from 'path'
dotenv.config();

const routes = Router()

routes.get('/', async (req, res) =>
{
    try 
    {
        const {nickname, id} = req.query;
        const user_validation = {password: false, email: false, email_confirm: false}
        const get_user = async () => {
            const author = await  Users.findOne({$or: [{nickname: String(nickname)}, {_id: id}]}, user_validation);
            if(author) await confirm_session(author)
            else res.status(404).json({author: false, message: "user not found"})
        }

        const confirm_session = async (author: user_interface) => {
            if(req.session && req.session.userId)
            {
                if(String(author._id) === String(req.session.userId)) res.status(200).json({author: author, session: true, mycount: true})
                else await confirm_user_is_following_author(author, req.session.userId)
            } else res.status(200).json({author: author, status: "ok"})
        }

        const confirm_user_is_following_author = async (author:user_interface, userId:string) => {
            const confirm_user_is_following = await User_follows.findOne({users: Types.ObjectId(userId) , authorId: author._id }, user_validation)
            if(confirm_user_is_following) res.status(200).json({author: author, session: true, following: true})
            else res.status(200).json({author: author, session: true, following: false})
        }

        await get_user();
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send({error: "server eror"})
    }
})

routes.get('/books', async (req, res) =>
{
    try 
    {
        const {list, id, nickname} = req.query;
        
        const get_popular_books_by_id = async () => {
            const best_book = await Books.find({author: id, published: true}).skip(16 * Number(list) || 0).limit(16).sort({likes: 1})
            if(best_book) res.status(200).json({books: best_book})
            else res.status(200).json({books: []})
        }

        const get_popular_books_by_nickname = async () => {
            const author = await Users.findOne({nickname: String(nickname)}, {_id: true})
            if(author)
            {
                const best_book = await Books.find({author: author._id, published: true}).skip(16 * Number(list) || 0).limit(16).sort({likes: 1})
                if(best_book) res.status(200).json({books: best_book})
                else res.status(200).json({books: []})
            } else res.status(404).json({message: "not found"})
            
        }
        
        if(nickname) await get_popular_books_by_nickname();
        else if(id) await get_popular_books_by_id();
        else res.status(404).json({message: "not found"});
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.patch('/', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const { name, nickname, email, introduction, social_networks  } = req.body;
            var data:any = { name, nickname, email, introduction, social_networks};
            
            //remove undefined key
            for (const key in data)  if(data[key] === undefined)  delete data[key];
            const update_user = await Users.updateOne({_id: req.session.userId}, data)
            
            if(update_user) res.status(200).json({updated: true})
            else res.status(404).json({updated: false})
        } else res.status(403).send('forbidden')
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
    
})

routes.patch("/avatar", multer.single("image"), async (req, res) =>
{
    try 
    {
        const avatar = req.file.filename;
        const delete_image_file = async () => {
            await fs.unlink(path.join(__dirname, "../" + avatar), () => false )
        }
        
        if(req.session && req.session.userId)
        {
            const userId = req.session.userId;

            const save_avatar = async () => {
                const save_user = await Users.updateOne({_id: userId}, {avatar: avatar})
                if(save_user) res.status(200).json({status: "ok"})
                else
                { 
                    await delete_image_file()
                    res.status(500).json({error: "server error"})
                }
            }

            const delete_previous_image = async (avatar:string) => {
                if(avatar) await fs.unlink(path.join(__dirname, "../" + avatar), () => false )
                await save_avatar()
            }

            const get_user = async () => {
                const user_avatar = await Users.findOne({_id: userId}, {avatar:true})
                if(user_avatar) await delete_previous_image(user_avatar.avatar)
                else 
                {
                    await delete_image_file()
                    res.status(404).json({error: "not found"})
                }
            }

            await get_user()
        } 
        else
        {
            await delete_image_file()
            res.status(401).json({error: "Unathorized"})
        }
    }
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.get("/my-books", async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const list = Number(req.query.list);
            const userId = req.session.userId;
            const get_user_books = async  () => {
                const books = await Books.find({author: userId}).skip(list | 0).limit((list + 1 ) * 16)
                if(books) res.status(200).json({books})
                else res.status(200).json({books: []})
            }

            await get_user_books()
            
        } else res.status(401).json({error: "Unauthorized"})
    } 
    catch (error)
    {
        if(process.env.NODE_ENV === "development") console.error(error);
        res.status(500).send('server error')
    }
})


export default routes;