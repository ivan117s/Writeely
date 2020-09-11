import express from 'express';

//Main dependencies
import dotenv from 'dotenv';

import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import conectMongo from 'connect-mongo';
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression'
import path from 'path';
import serveStatic from 'serve-static';
//dev dependencies
import morgan from 'morgan';
//Routes
import session_routes from './routes/session';
import book_routes from './routes/book';
import books_routes from "./routes/books";
import follows_routes from './routes/follow'; 
import user_routes from './routes/user';
import chapter_routes from './routes/book/chapter';
import page_routes from './routes/book/page';
import pages_routes from './routes/book/pages';
import book_likes_routes from './routes/book/like';

dotenv.config();

export default class App 
{ 
    app = express();
    middlewares()
    {
        if(process.env.NODE_ENV === "development")
        {
            this.app.use(morgan('dev'));
        }
        const mongo = conectMongo(session)
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.disable('x-powered-by');
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(serveStatic(path.join(__dirname, "./build")))
        this.app.use(bodyparser.json({limit: '1mb'})); 
        this.app.set('trust proxy', 1)
        this.app.use(bodyparser.urlencoded({ extended: false }))
        this.app.use('/api/v1', session(  
        {
            secret: "this is a secret dc",
            name : 'sessionId',
            store: new mongo({mongooseConnection: mongoose.connection}), 
            cookie: 
            {
                maxAge: 3 * 3600 * 1000 /*3 hours*/,
                secure:  false
            }, 
            resave: false,
            saveUninitialized: true
        }))
        this.app.use("/images", express.static(path.join(__dirname, "../images")))
    }
    
    routes()
    {
        //user
        this.app.use('/api/v1/session', session_routes);
        this.app.use('/api/v1/user', user_routes);
        this.app.use('/api/v1/follows', follows_routes);
        //book
        this.app.use('/api/v1/book', book_routes);
        this.app.use('/api/v1/chapter', chapter_routes);
        this.app.use('/api/v1/page', page_routes);
        this.app.use('/api/v1/pages', pages_routes);
        //books
        this.app.use('/api/v1/books', books_routes);
        this.app.use("/api/v1/book-like", book_likes_routes)
        this.app.get('*', (req, res) =>
        {
            res.sendFile(path.join(__dirname, './build/index.html'))
        })
     
    }

    async database()
    {
        mongoose.set('useCreateIndex', true);
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/wrixy', (error) =>
        {
            if(error) console.log(error);
            
            console.log('mongodb connected');
        })
    }

    async server()
    {
        await this.app.listen(process.env.PORT || 4000, () =>
        {
            console.log('server on port', Number(process.env.PORT || 4000));  
        })
    }

    async start()
    {
        this.middlewares();
        this.routes()
        this.database();
        this.server();
    }
}

