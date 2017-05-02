const helpers = () => {

    const capitalize = (string) => {
        let str = [];
        string.split(' ').map( word  => {
            str.push(word.charAt(0).toUpperCase() + word.substring(1, word.length));
        });
        return str.join(' ');
    }

    return {
        capitalize: capitalize
    }
}

module.exports = helpers;