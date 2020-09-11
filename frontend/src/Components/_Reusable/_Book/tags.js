import React from 'react'

export default function MainTag({genres}) 
{
    return (
    <div className="book-tags">
        <div className="book-tags-container">
            <div className="book-tag-list">
                {genres.map((item, i) =>
                {
                    return(
                    <div className="tag-box" key={i + 1}>
                        <p className="tag-sign">{item.tag}</p>
                    </div>)
                })}
            </div>
        </div> 
    </div>)
}
