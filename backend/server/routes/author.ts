import {Router} from 'express';
import pool from '../database';
const router = Router();

router.get("/:authorId", async (req, res) =>
{
    try 
    {
        const {authorId} = req.params;

        const get_author_by_id = async () => {
            const author = await pool.query(`select * from authors where authorId = ${authorId}`)
            if(author && author[0]) 
                res.json({author: author,status:"ok"})
            else 
                res.status(404).json({error: "error"})
        }

        await get_author_by_id()
    } 
    catch (error) 
    {
        res.status(500).json({error: "error"})
    }
})