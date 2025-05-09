import {Component} from 'react';
import React from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types'
import './charList.scss';

class CharList extends Component {
    myRef = React.createRef();
    state = {
        charList: [],
        loading: true, //относится к первичной загруске
        error: false,
        newItemLoading: false, //относится к загруске новых эл-ов
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount () {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }
        
        this.setState(({offset, charList})=>({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset+9,
            charEnded: ended
        }))
    }

    onError = ()=>{
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }
    focusOnItem = (i) => {
        this.itemRefs.forEach((ref)=>{ref.classList.remove('char__item_selected')})
        this.itemRefs[i].classList.add('char__item_selected');
        this.itemRefs[i].focus();
    }

    renderItems (arr) {
            const items =  arr.map((item, i) => {
                let imgStyle = {'objectFit' : 'cover'};
                if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                    imgStyle = {'objectFit' : 'unset'};
                }
                return (
                    <li 
                        tabIndex={0}
                        ref={this.setRef}
                        className="char__item"
                        key={item.id}
                        onClick={() => {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                            }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' '){
                                e.preventDefault();
                                this.focusOnItem(i);
                                this.props.onCharSelected(item.id);
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

    render () {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        
        const items = this.renderItems(charList);
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
                onClick={()=>this.onRequest(offset)}
                style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;