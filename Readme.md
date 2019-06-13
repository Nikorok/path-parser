#  Path-Parser
Simple lib for parse url
## Installation
```
npm install path-parser
```
## Usage
```javascript
const pathParser = require('path-parser');
```
 - `compile(template)`
    * pattern : String
    * return: `{ template, pattern, keys: { name, type } }`
    * ```javascript
        const pattern = pathParser.compile('/user/{name:string}/{id:number}/{post:any}');
        // parameters must be in format {Parameter name: Parameter type}
        // There're 3 types: string, number, any
        
        console.log(pattern);
        /*
        * { 
        * template: '/user/{name:string}/{id:number}/{post:any}', 
        * pattern: /^\/user\/(\w+)\/(\d+)\/(.+)\/?$/, 
        * keys: [ 
        *     { name: 'name', type: 'string' }, 
        *     { name: 'id', type: 'number' }, 
        *     { name: 'post', type: 'any' } 
        *   ] 
        * }
        * */
      ```
- `compare(pattern, uri)`
   * pattern: Object
   * return: `false` || `true`
   * ```javascript
        console.log(pathParser.compare(pattern, '/user/Nikita/123/My-post123/'));
        // true
   
        console.log(pathParser.compare(pattern, '/user/Nikita/123/'));
        // false
   
        console.log(pathParser.compare(pattern, '/user/Nikita/String/My-post123/'));
        // false, because second parameter must be number
     ```
- `insert(pattern, parameters)`
   * pattern: Object
   * return: `url`
   * ```javascript
        console.log(pathParser.insert(pattern, {name: "John", id: 321, post: "MyPost-123"}));
        // /user/John/321/MyPost-123
   
        console.log(pathParser.insert(pattern, {name: "John", id: 321, post: "My-Post"}));
        // /user/John/321/{post:any}, parameter "post" doesn't fill with value because 
        // it has type any, but in parameters it has type string
     ```
- `scan(pattern, uri)`
   * pattern: Object
   * return: `null` || `parameters`
   * ```javascript
        console.log(pathParser.scan(pattern, '/user/Nikita/123/My-post123/'));
        // {name: "Nikita", id: "123", post: "My-post123"}
   
        console.log(pathParser.scan(pattern, '/user/Nikita/123/'));
        // null
   
        console.log(pathParser.scan(pattern, '/user/Nikita/String/My-post123/'));
        // null
     ```