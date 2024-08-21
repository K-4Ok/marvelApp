import { Component } from "react";
import './charListItem.scss';


class CharListItem extends {Component} {
    // state = {
    //     list: [
    //         { thumbnail: 'abbys' },
    //         { name: 'abbys' },
    //     ]
    // }

    Elements (item) {
        const {default : {thumbnail, name}} = this.state;
        this.state.default.map(item => {
            return (
            <li className="char__item">
                <img src={thumbnail} alt={name}/>
                <div className="char__name">{name}</div>
            </li>
            )
        });   
    }
    

    render () { 
        const {list} = this.state;
        const elements = this.Elements(list)
        return (
            {elements}
        )
    }
}

export default CharListItem;