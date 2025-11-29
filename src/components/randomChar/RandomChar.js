import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from "../../services/MarvelService";
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    
    const [char, setChar] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    useEffect (()=>{
        updateChar();
    }, []);

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const updateChar = () => {
        const id = Math.floor(Math.random()*(20 - 1) + 1);
        onCharLoading();
        marvelService.getCharacter(id)
        .then(onCharLoaded)
        .catch(onError); 
        // когда используется цепочка с then и в 
        // её скобках идёт просто ссылка на функцию, то аргумент который придёт
        // в then автоматически будет подставлен в функцию в скобках, в данном
        // случае он придёт в char (строка 17), в данном случае объект
    }

        const onRender = () => {
            return error ? <ErrorMessage/> : (loading ? <Spinner/> : <View char={char}/>)
            // тут идёт проброска объекта char который придёт с сервера из компонента 
            // RandomChar в компонент View как props
        }

        return ( // статичная часть блока, та что спарва
            <div className="randomchar">
                {onRender()}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main"
                    onClick={updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
}

// динамическая часть блока, та что слева:
const View = ({char}) => { // тут {char} означает передачу в props компонента ОБЪЕКТ char.
    const {name, description, thumbnail, wiki, homepage} = char; // деструктуризация объекта char
    let imgStyle = {'objectFit':'cover'};
    if (thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    } 
       
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description ? `${description.slice(0, 228)}...` : 'There is no description with this character'}                         
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;