import {Router} from 'express'; 
import {Books} from '../models/book';

const routes = Router()

routes.get("/", async (req, res) =>
{
    try 
    {
        const {g1, g2, g3, title, popular, authors, list}:any = req.query;
        var genres:string[] = []; 
        [g1, g2, g3].forEach((item:string | undefined) =>
        {
            if(item !== undefined) genres.push(item)
        })

        const get_books_by_title_genres = async () => {
            const popular_confing = popular ? {likes: -1} : {createdAt: -1};
            const author_config = authors ? "author" : ""
            const books = await Books.find({genres: {$elemMatch: {tag: {$in: genres}},}, title: {$regex: `^(${escapeRegEx(title)})`, $options: "si"}, published: true}).skip(16 * list || 0).limit(16).populate(author_config).sort(popular_confing)
            if(books) res.status(200).send({books: books, status: "ok"})
            else  res.status(200).send({books: [], status: "ok"})
        }

        const get_books_by_genres = async () => {
            const popular_confing = popular ? {likes: -1} : {createdAt: -1};
            const author_config = authors ? "author" : ""
            const books = await Books.find({published: true, genres: {$elemMatch: {tag: {$in: genres} }}}).skip(16 * list || 0).limit(16).populate(author_config).sort(popular_confing)
            if(books)  res.status(200).send({books: books, status: "ok"})
            else  res.status(200).json({books: [], status: "ok"})
        }

        const escapeRegEx = (s:string):any => {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        const books_by_title = async () =>  {
            const popular_confing = popular ? {likes: -1} : {createdAt: -1};
            const author_config = authors ? "author" : "";
            const books = await Books.find({title: {$regex: `^(${escapeRegEx(title)})`, $options: "si"}, published: true}).skip(16 * list || 0).limit(16).sort(popular_confing).populate(author_config);
            if(books)  res.status(200).json({books: books, status: "ok"})
            else res.status(200).json({books: [], status: "ok"})
        }

        const books_default = async () => {
            const author_config = authors ? "author" : "";
    
            const popular_confing = popular ? {likes: -1, } : {createdAt: -1};
            const books =  await Books.find({published: true}).skip(16 * list || 0).limit(16).populate(author_config).sort(popular_confing)
            if(books) res.status(200).json({books: books, status: "ok"})
            else res.status(200).json({books: [], status: "ok"})
        }
        
        if(genres.length > 0)
        {
            if(title) await get_books_by_title_genres()
            else await get_books_by_genres()
        }
        else
        {
            if(title) await books_by_title()
            else await books_default()
        }
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})


routes.get("/recommend", async (req, res) =>
{
    try 
    {
        const get_random_list = async (count: number) =>
        {
            const random_number = Math.floor(Math.random() * count) 
            const random_list = Math.floor(random_number / 16)
            const books = await Books.find({}).skip(random_list * 16).limit(16)
            if(books) res.status(200).json({books})
            else res.status(200).json({books: []})
        }
       
        const books_count = await Books.estimatedDocumentCount()
        if(books_count) await get_random_list(books_count)
        else res.status(200).json({books: []})
    } 
    catch (error) 
    {
        if(process.env.NODE_ENV === "development") console.error(error);
        res.status(500).send('server error')
    }
})

export default routes;