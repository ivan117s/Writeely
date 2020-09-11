import {Router} from 'express'
import { Book_likes } from '../../models/book_likes';
import { Types } from 'mongoose';
import { Books } from '../../models/book';

const routes = Router();

routes.post("/like", async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const bookId_string = req.query.bookId,
            userId = req.session.userId,
            bookId = Types.ObjectId(String(bookId_string)) ;

            const confirm_user_likes_book = async () =>
            {
                const user_likes = await Book_likes.findOne({bookId: bookId, users: userId});
                if(!user_likes) await save_book_like()
                else res.status(200).json({status: "ok", message: "the user already likes the book"})
            }

            const save_book_like = async () =>
            {
                const save_like = await Book_likes.updateOne({bookId: bookId,}, {$addToSet: {users: Types.ObjectId(userId)}})
                if(save_like) await get_books_likes_count()
                else res.status(500).json({status: "error", message: "the like couldn't save"})
            }

            const get_books_likes_count = async () => 
            {
                const likes_count:any[] = await Book_likes.aggregate([{$match: {bookId: bookId}}, {$project: { count: { $size: "$users" }}}])
                if(likes_count && likes_count[0]) await save_books_likes_count(likes_count[0].count)
                else res.status(500).json({error: "server error", message: "book error"})
            }

            const save_books_likes_count = async (likes_count: number) => 
            {
                if(likes_count !== undefined && typeof likes_count === "number")
                {
                    const save_books_count = await Books.updateOne({_id: bookId}, {likes: likes_count})
                    if(save_books_count) res.status(200).json({status: "ok", message: "user likes the book"})
                } else res.status(200).json({status: "ok but there is an error"})
            }

            await confirm_user_likes_book()

        } else res.status(401).send({error: "Unauthorized"})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
    
})

routes.post("/remove-like", async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const bookId_string = req.query.bookId,
            userId = req.session.userId,
            bookId = Types.ObjectId(String(bookId_string)) ;

            const confirm_user_likes_book = async () =>
            {
                const user_likes = await Book_likes.findOne({bookId: bookId, users: userId});
                if(user_likes) await remove_book_like()
                else res.status(200).json({status: "ok", message: "the user doesn't like the book yet"})
            }
            
            const remove_book_like = async () =>
            {
                const save_like = await Book_likes.updateOne({bookId: bookId,}, {$pull: {users: Types.ObjectId(userId)}})
                if(save_like) await get_books_likes_count()
                else res.status(500).json({status: "error", message: "the like couldn't save"})
            }
            
            const get_books_likes_count = async () => 
            {
                const likes_count:any[] = await Book_likes.aggregate([{$match: {bookId: bookId}}, {$project: { count: { $size: "$users" }}}])
                if(likes_count && likes_count[0]) await save_books_likes_count(likes_count[0].count)
                else res.status(500).json({error: "server error", message: "book error"})
            }

            const save_books_likes_count = async (likes_count: number) => 
            {
                if(likes_count !== undefined && typeof likes_count === "number")
                {
                    const save_books_count = await Books.updateOne({_id: bookId}, {likes: likes_count})
                    if(save_books_count) res.status(200).json({status: "ok", message: "user likes the book"})
                } else res.status(200).json({status: "ok but there is an error"})
            }
            
            await confirm_user_likes_book();

        }    
           
    }
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

export default routes;