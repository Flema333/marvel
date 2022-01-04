class MarvelService{
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=f052699492740fe548edaf82f49551fb'
    _baseOffeset = 210
    getResource = async (url) => {
        let res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return res.json()
    }
    
    getAllCharacters = async(offset = this._baseOffeset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(item => this._transformCharacter(item));
    }

    getCharacter = async(id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);

        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter = (char) => {
        if(char.description === ''){
            char.description = 'This character doesn`t have description'
        }
        if (char.description.length > 212){
            char.description = char.description.substring(0, 211) + '...'
        }

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

export default MarvelService