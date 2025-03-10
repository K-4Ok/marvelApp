class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apikey = 'apikey=7fd366f40de527e2a61ba5665e45d2c5';
    _baseOffset = 210;
    
    getResource = async (url) => {
        let res = await fetch(url);
    
        if(!res.ok) {
            throw new Error (`Could not fetch ${url}, status ${res.status} with reason `);
       }
    
        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apikey}`);
        return res.data.results.map(this._transformCharacter); // в итоге сформируется массив с 9-ю объектами,
        // то же самое было бы если map.(item => this._transformCharacter(item))
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apikey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

}

export default MarvelService;