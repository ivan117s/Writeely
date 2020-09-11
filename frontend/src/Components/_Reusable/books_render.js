import React from 'react';
import Book from './_Book';

export function BooksRender({books, edit}) 
{
    return(
    books.map((item) =>
    {
        return( 
        <Book 
            id={item._id} 
            genres={item.genres} 
            cover={item.cover} 
            synopsis={item.synopsis} 
            avatar={item.author.avatar}
            edit={edit | false}
            author={item.author.nickname} 
            title={item.title} 
            likes={item.likes} 
            key={item._id}/>)
    }))
}

export function BooksGridRender({books, edit}) 
{
    return(
    books.map((item) =>
    {
        return( 
        <div className="grid-book" key={item._id}>
            <Book 
                id={item._id} 
                genres={item.genres} 
                cover={item.cover} 
                synopsis={item.synopsis} 
                avatar={item.author.avatar}
                edit={edit | false}
                author={item.author.nickname} 
                title={item.title} 
                likes={item.likes} 
                />
        </div>)
    }))
}

export function LoadingBooksGrid() 
{
    const fill_loading = (() =>
    {
        let elements = []
        for (let index = 0; index < 20; index++) {
            
            elements.push({_id: index})
        }
        return elements
    })();

    return(
    fill_loading.map((item, i) =>
    {
        return(
        <div className="grid-book grid-book--loading" key={item._id}>
            <div className="home__book">
                <div className="book__image"></div>
                <div className="book__content">
                    <div className="content__container"></div>
                </div>
            </div>
        </div>) 
    }))
}


export function LoadingBooksList() 
{
    const fill_loading = (() =>
    {
        let elements = []
        for (let index = 0; index < 20; index++) {
            
            elements.push({_id: index})
        }
        return elements
    })();

    return(
    fill_loading.map((item, i) =>
    {
        return(
        <div className="grid-book-loading" key={item._id}>
            <div className="home__book home__book--loading">
                <div className="book__image"></div>
                <div className="book__content">
                    <div className="content__container"></div>
                </div>
            </div>
        </div>) 
    }))
}
