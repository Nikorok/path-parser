const url = require('url');

const DEFAULT_DELIMITER = '/';

const KEY_DEFAULT = /\{(\w+):(\w+)\}/g;
const KEY_ANY_REGEXP = /\{(\w+):any\}/g;
const KEY_STRING_REGEXP = /\{(\w+):string\}/g;
const KEY_NUMBER_REGEXP = /\{(\w+):number\}/g;


const compile = (template, options) => {
    const delimiter = (options && options.delimiter) || DEFAULT_DELIMITER;

    const path = template.split(delimiter);
    const pattern = new RegExp("^" +
        template
            .replace(KEY_ANY_REGEXP, "([a-zA-Z0-9_-]+)")
            .replace(KEY_STRING_REGEXP, "([A-Za-z_-]+)")
            .replace(KEY_NUMBER_REGEXP, "([0-9]+)")
        + "\/?"
        + "$");

    var keys = [];
    for(const part of path) {
        if(part.search(KEY_ANY_REGEXP) > -1){
            var keyName = KEY_ANY_REGEXP.exec(part)[1];
            keys.push({name: keyName, type: "any"});
        }
        else if(part.search(KEY_STRING_REGEXP) > -1){
            var keyName = KEY_STRING_REGEXP.exec(part)[1];
            keys.push({name: keyName, type: "string"});
        }
        else if(part.search(KEY_NUMBER_REGEXP) > -1){
            var keyName = KEY_NUMBER_REGEXP.exec(part)[1];
            keys.push({name: keyName, type: "number"});
        }
        else if(part.search(KEY_DEFAULT) > -1){
            throw new Error("Undefined variable type!");
            return null;
        }
    }

    return {template, pattern, keys};
};
const compare = (pattern, uri) => {
    if (pattern === null) throw new Error("Pattern must be an object");

    const pathname = url.parse(uri, true).pathname;

    return pattern.pattern.test(pathname);
};

function scan(pattern, uri) {
    if (pattern === null) throw new Error("Pattern must be an object");

    const pathname = url.parse(uri, true).pathname;

    if(!compare(pattern, uri)){
        return null;
    }

    const values = pattern.pattern.exec(pathname).splice(1);
    var params = {};

    for (var i = 0; i < pattern.keys.length; i++) {
        params[pattern.keys[i].name] = values[i];
    }

    return params;
}

const insert = (pattern, params) => {
    if (pattern === null) throw new Error("Pattern must be an object");

    let template = pattern.template;

    for(const key in params){

        var regexp = null;

        if(params[key].toString().search(/^[A-Za-z_-]+$/) > -1)
            regexp = new RegExp('\\{'+key+':string\\}');
        else if(params[key].toString().search(/^[0-9]+$/) > -1)
            regexp = new RegExp('\\{'+key+':number\\}');
        else
            regexp = new RegExp('\\{'+key+':any\\}');

        template = template.replace(regexp, params[key]);
    }

    return template;
};

module.exports = {
    compile,
    compare,
    insert,
    scan
};