import {Router} from 'express'; 
import { Types } from 'mongoose';
import { Books, book_interface } from '../../models/book';
import { Users } from '../../models/user';
import { Chapters } from '../../models/chapter';
import { Book_likes } from '../../models/book_likes';
import multer from '../../multer';
const routes = Router()


routes.post('/', multer.single("image"), async  (req, res) =>
{
    try 
    {
        const { title, tags, synopsis, genres } = JSON.parse(req.body.book);
        
        if(req.session && req.session.userId) 
        {
            const userId = Types.ObjectId(req.session.userId)

            const get_book_count = async () => {
                const count  = await Books.find({userId: userId}).countDocuments()
                return count | 0;
            }

            const update_user_book_count = async () => {
                const update_books = await Users.updateOne({_id: userId}, {books: await get_book_count()})
                if(update_books)
                {
                    res.status(200).json({valid: true, book: create_book})
                } else res.status(400).json({valid: false, book: false})
            }
            
            
            const save_like_counter = async (book:book_interface) => {
                const result = await new Book_likes({bookId: book._id}).save()
                if(result) update_user_book_count()
                else res.status(403).json({error: 'error'})
            }

            const save_book = async (book:book_interface) => {
                const save_book = await book.save()
                if(save_book) await save_like_counter(book); 
                else res.status(400).json({valid: true, book: false});
            }

            const create_book = new Books({title: title, genres: genres, tags:tags, cover: req.file.filename, synopsis: synopsis, author: userId})
            if(create_book) await save_book(create_book)
            else res.status(400).json({valid: false, book: false})

        } else res.status(401).json({error: 'session not initialized'})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.get('/', async  (req, res) =>
{
    try 
    {
        const {id, author, chapters} = req.query;

        const confirm_session_book_editable = async (book:book_interface) => 
        {
            const book_chapters = chapters ? await get_chapters() : null;
            if(req.session && req.session.userId) 
            {
                const user_is_following = await confirm_user_like(req.session.userId)
                const editable_confirm = String(book.author._id) === String(req.session.userId)
                res.status(200).json({book: book, editable: editable_confirm, liked: user_is_following, session:true, chapters: book_chapters})
            } else res.status(200).json({book: book, chapters: book_chapters })
        }

        const confirm_user_like = async (userId:string) => {
            const result = await Book_likes.findOne({bookId: Types.ObjectId(String(id)), users: Types.ObjectId(userId)})
            if(result) return true;
            else return false
        }
        
        const get_chapters = async ():Promise<any[]> => {
            const chapters = await Chapters.find({bookId: Types.ObjectId(String(id))})
            if(chapters) return chapters
            else return []
        }
          
        if(id) 
        {
            const author_populate = author ? "author" : "";
            const book = await Books.findById(id).populate(author_populate)
            if(book) confirm_session_book_editable(book);
            else res.status(404).json({book: false});
        }
        else res.status(404).json({status: "not found"})
        
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.patch("/", async (req, res) =>
{
    try 
    {
        const {id} = req.query;
        const {title, synopsis, cover} = req.body;
        var data:any = {title, synopsis, cover};

        for (const key in data)  if(data[key] === undefined) delete data[key];

        if(req.session && req.session.userId)
        {
            const userId = req.session.userId;
            const confirm_author = async (book:book_interface) => {
                if(String(book.author) === String(userId)) await update_book()
                else res.status(403).json({message: "forbidden"})
            }

            const update_book = async () => {
                const result = await Books.updateOne({_id: id}, data)
                if(result)  res.status(200).json({status :"ok", result: {updated: true}})
                else res.status(200).json({error:"not updated"});
            }
            
            const book = await Books.findOne({_id:Types.ObjectId(String(id))}, {_id:true, author: true});
            if(book) await confirm_author(book)
            else res.status(404).json({error:"error"})

        } else res.status(401).json({error: "Unathorized"});
    } 
    catch (error) 
    {
        res.status(500).json({error: "server error"})
    }
})

routes.post("/:bookId/publish", async (req, res) =>
{
    try
    {
        if(req.session && req.session.userId)
        {
            const {userId} = req.session;
            const {bookId} = req.params;

            const publish_book = async () => {
                const update_book =  await Books.updateOne({_id: bookId}, {published: true})
                if(update_book) res.status(200).json({status: "ok"})
                else res.status(404).json({error: "book not found"})
            }

            const validate_user = async () => {
                const result = await Books.findOne({author: userId})
                if(result) await publish_book()
                else res.status(404).json({error: "forbidden"})
            }
            
            await validate_user()

        } else res.status(401).json({error: "Unauthorized"})
    }
    catch (error) 
    {
        res.status(500).json({error: "server error"})
    }
})

routes.patch("/:bookId/publish", async (req, res) =>
{
    try
    {
        if(req.session && req.session.userId)
        {
            const {userId} = req.session;
            const {bookId} = req.params;

            const hide_book = async () => {
                const update_book =  await Books.updateOne({_id: bookId}, {published: false})
                if(update_book) res.status(200).json({status: "ok"})
                else res.status(404).json({error: "book not found"})
            }

            const validate_user = async () => {
                const result = await Books.findOne({author: userId})
                if(result) await hide_book()
                else res.status(404).json({error: "forbidden"})
            }
            
            await validate_user()

        } else res.status(401).json({error: "Unauthorized"})
    }
    catch (error) 
    {
        res.status(500).json({error: "server error"})
    }
})

export default routes;