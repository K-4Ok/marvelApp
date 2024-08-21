import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from "../../services/MarvelService";
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount(){
        // clearInterval(this.timerId);
    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false}) // аналог char: char, в данном случае вместо второго
        // char будет подставлен объект вернувшийся из then строки 25
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({ loading: false, error: true})
    }

    updateChar = () => {
        const id = Math.floor(Math.random()*(1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService.getCharacter(id)
        .then(this.onCharLoaded)
        .catch(this.onError) 
        // когда используется цепочка с then и в 
        // её скобках идёт просто ссылка на функцию, то аргумент который придёт
        // в then автоматически будет подставлен в функцию в скобках, в данном
        // случае он придёт в char (строка 17), в данном случае объект
    }


    render () {
        const {char, loading, error} = this.state;
        const onRender = () =>{
            return error ? <ErrorMessage/> : (loading ? <Spinner/> : <View char={char}/>)
        }

        return (
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
                    onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, wiki, homepage} = char;
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