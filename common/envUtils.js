const dotenv = require('dotenv');

let loaded = false;

const loadEnv=()=> {
    if (!loaded) {
        dotenv.config();
        loaded = true;
    }
}
    /**
     * @param {string} key 
     * @return {string}
     */

    const get =(key)=> {
        const value = process.env[key];
        if (!value) {
            throw new Error(`missing env variables: ${key}`);

        }
        return value;
    } 

module.exports = {
    loadEnv,
    get,
}