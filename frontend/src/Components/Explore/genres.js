import React from 'react'

const list = [
{
    tag: "Acción",
    id: 1
},
{
    tag: "Aventura",
    id: 2
},
{
    tag: "Ciencia ficción",
    id: 3
},
{
    tag: "Fanfic",
    id: 4
},
{
    tag: "Fantasia",
    id: 5
},
{
    tag: "Personas y blogs (no ficción)",
    id: 6
},
{
    tag: "Poesia",
    id: 7
},
{
    tag: "Romance",
    id: 8
},
{
    tag: "Suspense",
    id: 9
},
{
    tag: "Terror",
    id: 10
},
{
    tag: "Tutoriales y autoayuda" ,
    id: 11
},
{
    tag: "Espiritual",
    id: 12
}, 
{
    tag: "Misterio",
    id: 13
}]


function Genres({change_state_value, genres}) 
{
    function change(items) {
        change_state_value("genres", items )
    }

    function select(id) 
    {
        let genres_list = genres;
        list.find(item =>
        {
            if(item.id === id && genres.length < 3 )  genres_list.push(item)
            return false
        })
        change(genres_list)
    }

    function remove(id) 
    {
        let index, genres_list;
        genres.forEach((item, i) =>
        {
            if(item.id === id ) index = i;
            return false
        })
        genres_list = genres;
        genres_list.splice(index, 1)
        change(genres_list)
    }
    
    return(
    <div className="explore-search-element__genres">
        <span className="explore-search-element__genres-title">Géneros  ( 3 maximo )</span>
        <GenresSelected items={genres}/>
        <div className="explore-search-element__genres-list">
            {list.map((item, i) =>
            {
                let s = false;
                genres.forEach(element => 
                {
                    if(element.id === item.id)  s = true
                  
                });
                return <CheckButton select={select} remove={remove} selected={s} genres={genres} text={item.tag} id={i + 1}  key={i + 1} />
            })}
        </div>
    </div>)    
}

export default Genres;

function GenresSelected({items}) 
{
    return(
    <div className="genres-list-selected">
        {items.map((item, i) =>
        {
            return(
            <div className="genres-list-selected__item" key={i}>
                <span>{item.tag}</span>
            </div>)
        })}
    </div>)
}

function CheckButton({text, id, select, genres, remove, selected}) 
{
    const classname = selected 
    ? "genres-list-grid__item--selected" 
    : "genres-list-grid__item";
    
    function select_button() 
    {
        var is_taken =  false;
        genres.forEach(element => 
        {
            if(element.id === id) is_taken = true;
            return false
        });
        if(!is_taken)
        {
            if(genres.length < 3)  select(id)
        } 
        else remove(id)
    }

    return(
    <button onClick={select_button} className={classname}>
        <p>{text}</p>
    </button>)
}

