import {Router} from 'express';
import {Chapters, chapter_interface} from '../../models/chapter';
import {Books} from '../../models/book'; 
import { Pages } from '../../models/page';
const routes = Router();

routes.post('/:bookId', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const bookId = req.params.bookId
            const authorId = req.session.userId;
            const name = req.body.name;

            const confirm_is_authors_book = async () => {
                const author = await Books.findOne({_id: bookId, author: authorId}, {_id: true})
                if(author) await create_chapter()
                else res.status(403).json({status: "forbidden"})
            }

            const create_chapter = async () => {
                const new_chapter = new Chapters({name: name, author: authorId, bookId: bookId})
                if(new_chapter) await save_chapter(new_chapter)
                else res.status(500).json({error: "chapter invalid"})
            }

            const save_chapter = async (chapter:chapter_interface) => {
                const save_chapter =  await chapter.save()
                if(save_chapter)
                {
                    res.status(200).json({chapter: chapter})
                } else res.status(400).send('couldn"t change')
            }
            await confirm_is_authors_book()
        } else res.status(401).json({message: "Unauthorized"})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.delete('/:chapterId', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const chapterId = req.params.chapterId
            const authorId = req.session.userId;

            const delete_chapter = async () => {
                const delete_chapter =  await Chapters.deleteOne({_id: chapterId})
                if(delete_chapter) res.status(200).json({status: "ok"})
                else res.status(404).json({error: "couldn't delete"})
            }

            const delete_pages = async () => {
                const result = await Pages.deleteMany({chapterId: chapterId})
                if(result) await delete_chapter()
                else res.status(400).json({error: "not deleted"})
            }

            const confirm_is_authors_book = async () => {
                const author = await Chapters.findOne({_id: chapterId, author: authorId}, {_id: true})
                if(author) await delete_pages()
                else res.status(403).json({status: "forbidden"})
            }
            
            await confirm_is_authors_book()

        } else res.status(401).json({message: "Unauthorized"})

    } 
    catch (error) 
    {
        if(process.env.NODE_ENV === "development") console.error(error);
        res.status(500).send('server error')
    }
})

routes.put('/:chapterId', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const chapterId = req.params.chapterId,
            authorId = req.session.userId,
            name = req.body.name;
            const confirm_is_authors_book = async () => {
                const author = await Chapters.findOne({_id: chapterId, author: authorId}, {_id: true})
                if(author) await update_chapter();
                else res.status(403).json({status: "forbidden"})
            }

            const update_chapter = async () => {
                const update_chapter = await Chapters.updateOne({_id: chapterId}, {name: name});
                if(update_chapter) res.status(200).json({status: "ok"});
                else res.status(400).json({error: "not saved"});
            }

            await confirm_is_authors_book();
            
        } else res.status(401).json({error: "Unauthorized"})
    }
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).json({error:'server error'})
    }
})

export default routes;


