import {Router} from 'express'
import { Pages } from '../../models/page';

const router = Router()

router.get('/:chapterId', async (req, res) =>
{
    try 
    {
        const chapterId = req.params.chapterId;
        const pages = await Pages.find({chapterId: chapterId})
        if(pages) res.status(200).json({pages: pages})
        else res.status(404).json({pages: []})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

export default router;