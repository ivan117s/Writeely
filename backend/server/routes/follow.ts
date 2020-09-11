import { Router } from 'express';
import {Users} from '../models/user';
import {Types} from 'mongoose'
import { User_follows } from '../models/user_follows';
const routes = Router()

routes.get('/followed', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const users_followed = await User_follows.find( { users: req.session.userId}, {authorId: true}).populate("authorId")
            if(users_followed)
            {
                res.status(200).send({followed: users_followed});
            } else res.status(200).send({followed: []});
        } else res.status(403).send('session is not initializated')
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.post('/follow', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)   
        {
            const authorId =  String(req.query.author),
            userId = req.session.userId;

            const follow_author =  async () =>
            { 
                //check if the user is already following the author 
                const result = await User_follows.findOne({authorId: authorId, users: userId})
                if(!result) await save_follow()
                else res.status(500).json({error: "user is already following author"}) 
            }

            const save_follow = async () =>
            { 
                //save userId in author's followers list
                const result =  await User_follows.updateOne({authorId: authorId}, {$addToSet: { "users": Types.ObjectId(userId)} })
                if(result) await save_follow_count()
                else  res.status(403).json({error: "follow couldn't save"})
            }

            const save_follow_count = async () => 
            {
                //get author's follower count
                const follow_count:any[] = await User_follows.aggregate([{$match: {authorId: Types.ObjectId(authorId)}}, {$project: { count: { $size: "$users" }}}])
                if(follow_count && follow_count[0].count >= 0)  
                {
                    await save_authors_followrs_count(follow_count[0].count)
                }  else res.status(500).json({error: "server error"})
            }

            const save_authors_followrs_count = async (follow_count:number) =>
            {
                const set_follows_count =  await Users.updateOne({_id: authorId}, {followers: follow_count})
                if(set_follows_count) res.status(200).json({status: "ok", message: "following"})
                else res.status(500).json({error: "server error"})
            }

            //------------------------//

            if(String(authorId) !== String(userId)) await follow_author()
            else res.status(403).json({error: "same author"})
   
        } else res.status(403).json({error: 'session is not initializated'})
    }
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.post('/unfollow', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)   
        {
            const authorId = String(req.query.author),
            userId = req.session.userId;
            
            const unfollow_author =  async () =>
            { 
                //check if the user is already following the author 
                const result = await User_follows.findOne({authorId: authorId, users: userId})
                if(result) await remove_user_follow()
                else res.status(500).json({error: "the user is not following the author yet"}) 
            }

            const remove_user_follow = async () =>
            { 
                //save userId in author's followers list
                const result =  await User_follows.updateOne({authorId: authorId}, {$pull: { "users": Types.ObjectId(userId)} })
                if(result) await save_follow_count()
                else  res.status(403).json({error: "follow couldn't save"})
            }

            const save_follow_count = async () => 
            {
                //get author's followers count
                const follow_count:any[] = await User_follows.aggregate([
                {
                    $match: {authorId: Types.ObjectId(authorId)}
                }, 
                {
                    $project: { count: { $size: "$users" }}
                }])

                if(follow_count && follow_count[0].count >= 0)  
                {
                    await save_authors_followrs_count(follow_count[0].count)
                }  else res.status(500).json({error: "server error"})
            }

            const save_authors_followrs_count = async (follow_count:number) =>
            {
                const set_follows_count =  await Users.updateOne({_id: authorId}, {followers: follow_count})
                if(set_follows_count) res.status(200).json({status: "ok", message: "unfollow"})
                else res.status(500).json({error: "server error"})
            }
          
            if(String(authorId) !== String(userId)) await unfollow_author()
            else res.status(403).json({error: "same author"})

        } else res.status(403).send('session is not initializated')
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

export default routes;