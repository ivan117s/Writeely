import {Router} from 'express';
import {Chapters} from '../../models/chapter';
import { Pages } from '../../models/page';

const routes = Router()

routes.post('/:chapterId', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const chapterId = req.params.chapterId
            const authorId = req.session.userId;
           
            const save_new_page_db = async (page:any) => {
                const save_page = await page.save()
                if(save_page)  res.status(200).json({page: page})
                else  res.status(200).json({page: page})
            }
            
            const create_new_page = async () => {
                const new_page = new Pages({ chapterId: chapterId, author: authorId, content: [{content: ""}] })
                if(new_page) await save_new_page_db(new_page);
                else res.status(500).json({error: "server error"})
            }
            
            const validate_user = async () => {
                const result = await Chapters.findOne({_id: chapterId, author: authorId})
                if(result) await create_new_page()
                else res.status(403).json({error: "Forbidden"});
            }

            await validate_user()
            
        } else res.status(401).send({error: 'Unauthorized'})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.delete('/:pageId', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const pageId = req.params.pageId
            const authorId = req.session.userId;
            const delete_page = await Pages.deleteOne({_id: pageId, author: authorId})
            if(delete_page) res.status(200).json({deleted: true})
            else res.status(200).json({deleted: false})
           
        } else res.status(401).send({error: 'Unauthorized'})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})


routes.patch('/:pageId', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const paragraphs = req.body.paragraphs
            const pageId = req.params.pageId
            const authorId = req.session.userId;
            const update_page = await Pages.updateOne({_id: pageId, author: authorId}, {content: paragraphs})
            if(update_page)  res.status(200).json({deleted: true})
            else res.status(200).json({deleted: false})
           
        } else res.status(401).send({error: 'Unauthorized'})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})



export default routes;