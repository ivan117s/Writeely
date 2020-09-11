import {Router} from 'express'; 
import {Users, user_interface} from '../models/user';
import bcrypt from 'bcrypt'; 
import { User_follows } from '../models/user_follows';

const routes = Router()


routes.post('/login', async (req:any, res) =>
{
    try 
    {
        const {password, nickname} = req.body;

        const login = async () =>
        {
            //user exist
            var user = await Users.findOne({$or: [ {email: nickname}, {nickname: nickname} ]},  {views: false, email_confirm: false, recommended_books:false});
            if(user) await validate_pasword(user)
            else res.status(200).json({user_exist: false, status: "ok"})
        }

        const validate_pasword = async (user:user_interface)  =>
        {
            const correct_password = await bcrypt.compare(password, user.password);
            if(correct_password) 
            {
                req.session.userId = user._id;
                user = Object.assign(user, {password: false})
                res.status(200).json({status: "ok", result: { user: user, user_exist: true, password:true }})
            } 
            else res.status(200).json({status: "ok", result:{ user: false, user_exist: true, password: false}})
        }

        await login()
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.post('/singin', async (req, res) =>
{
    try 
    {
        const {nickname, name, email, password} = req.body;
        
        
      
        const save_follows_container = async (user_follows:any, new_user:user_interface) => 
        {
            const saved_user_follows = await user_follows.save();
            if(saved_user_follows)
            {
                if(req.session) req.session.userId = new_user._id;
                res.status(200).json({user: new_user, logged: true})
            } else res.status(500).json({error: "server error"})
        }

        const create_follows_container = async (new_user:user_interface) => 
        {
            const user_follows = new User_follows({authorId: new_user._id, users: [] })
            if(user_follows) await save_follows_container(user_follows, new_user)
            else res.status(500).send('error')
        }

        const create_new_user = async (encrypted_password:string) => 
        {
            const new_user = new Users(
            {
                nickname: nickname, 
                name: name, 
                email: email, 
                email_confirm: false,
                avatar: "",
                password: encrypted_password
            })
            const save_user = await new_user.save();
            if(save_user) await create_follows_container(new_user)
            else res.status(500).json({message: "user couldn't save"})
        }

        const encrypt_password = async () => 
        {
            const encrypted_password = await bcrypt.hash(password, 10)
            if(encrypted_password) await create_new_user(encrypted_password)
            else res.status(500).json({error: "encripted password error"})
        }

        const confirm_user_exist  = async () => 
        {
            const user =  await Users.findOne({$or: [{nickname: nickname, email: email}]}, {_id: true});
            if(!user) await encrypt_password()
            else res.status(200).json({user: false, user_exists: true, message: "incomplete operation"})
        }

        const space_regexp = new RegExp(/( )/gm)
        const nickname_has_not_spaces = !space_regexp.test(nickname)
        if(nickname_has_not_spaces) await confirm_user_exist()
        else res.status(500).json({user: false, user_exists: false, message: "invalid nickname"})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.post('/logout', async (req:any, res) =>
{
    try 
    {
        req.session.destroy()
        res.status(200).send('logged out')
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.get('/comfirm', async (req, res) =>
{
    try 
    {
        if(req.session && req.session.userId)
        {
            const userId = req.session.userId;
            const user = await Users.findOne({_id: userId},  
            {
                views: false, 
                password: false, 
                email_confirm: false,
                _id: false
            })
            if(user) res.status(200).json({user:user})
            else res.status(404).json({error: "user not found"})
        } else res.status(200).json({user: false})
    } 
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

routes.post("/comfirm-nickname", async (req, res) =>
{
    try 
    {
        const nickname:string = req.body.nickname;
        
        const comfirm_user_exist = async () => {
            const user = await Users.findOne({nickname: nickname})
            if(!user) res.status(200).json({user_available: true})
            else res.status(200).json({user_available: false})
        }
        await comfirm_user_exist()
    }
    catch (error) 
    {
       if(process.env.NODE_ENV === "development") console.error(error);
       res.status(500).send('server error')
    }
})

export default routes;