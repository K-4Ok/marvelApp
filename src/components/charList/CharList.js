import {useEffect, useState, useRef} from 'react';
import React from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types'
import './charList.scss';

 const CharList = (props) => {
    // myRef = React.createRef(); это классовое создание рефа в переменной myRef
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true); //относится к первичной загруске
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false); //относится к загруске новых эл-ов
    const [offset, setOffset] = useState(0);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(()=>{
        onRequest();
    },[])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
        .then(onCharListLoaded)
        .catch(onError)
    }
    const onCharListLoading = () => {
        setNewItemLoading(true);
    }
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }
        
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset+9);
        setCharEnded(charEnded => ended);
    }

    const onError = ()=>{
        setError(true);
        setLoading(loading => false);
    }

    // itemRefs = [];
    const itemRefs = useRef([]); // теперь внутри объекта useRef в свойстве current лежит массив
    // который будет перебираться в строке 62 через forEach, и дальше внутри каждого элемента этого
    // массива, а это будет ссылка на DOM элемент, мы будем убирать класс 'char__item_selected'
    

    // const setRef = (ref) => {
    //     this.itemRefs.push(ref);} 
    // тут в классовом варианте мы напрямую пушили сслыки на элементы в массив рефов
    // вписав 
    const focusOnItem = (id) => {
        itemRefs.current.forEach((ref)=>{ref.classList.remove('char__item_selected')})
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
        // внутри itemRefs.current будет лежать массив объявленный в 52-й строке как по умолчанию
    }

    function renderItems (arr) {
            const items =  arr.map((item, i) => {
                let imgStyle = {'objectFit' : 'cover'};
                if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                    imgStyle = {'objectFit' : 'unset'};
                }
                return (
                    <li 
                        tabIndex={0}
                        // ref={this.setRef} это было в классах
                        ref={(el)=> itemRefs.current[i] = el}
                        // вместо кода 57-58 стоках, для того чтобы устанавливать ссылки на DOM элементы 
                        // в массив itemRefs.current в отличае от классового варианта, мы не можем напрямую 
                        // пушить как в классовом компоненте. Посему вместо 57-58 прописываем не большую call
                        // back ф-ю прямо в 78-й строке. Сюда ref={} может размещаться callback ref который 
                        // принимает в себя единственным аргументом тот элемент на котором он был вызван в 
                        // данном случае это <li>, т.е. el это <li>. А так как у нас тут перебор т.е. map, то
                        // <li> создаются у нас внутри циклов. Т.е. элементы по порядку i мы складываем  в массив
                        // itemRefs.current, а el это ссылка на DOM элемент. Соответственно в itemRefs.current
                        // будет формироваться список т.е. массив ссылок на вот эти элементы которые будут
                        // последовательно формироваться. Короче в массив упадёт ссылка на li - шку. И это то что нам нужно.
                        className="char__item"
                        key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                            }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' '){
                                e.preventDefault();
                                focusOnItem(i);
                                props.onCharSelected(item.id);
                                }
                            }
                        }
                        >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                )
            });
            // А эта конструкция вынесена для центровки спиннера/ошибки
            return (
                <ul className="char__grid">
                    {items}
                </ul>
            )
    }

    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            onClick={()=>onRequest(offset)}
            style={{'display': charEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;