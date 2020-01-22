// In Node.js, every single file is treated as a module. 
// So this index.js is also a module.
const fs = require('fs');
const http = require('http');
const url = require('url');
// const slugify = require('slugify');
// Import the replaceTemplate from the moducles/replaceTemplate.js
const replaceTemplate = require('./modules/replaceTemplate');

// 1. We can do the synchronised version because we just only executed once, right at the beginning.
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // array 

// const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
// console.log(slugs);



const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true); // pathname === '/product', query === '?id=0'


    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html', }); 
        // 2. Replace the placeholders {% ~ %} with the content.
        // 2 - 1. Loop over the dataObj and for each iteration, we will replace the placeholders in the template with the actual data, which is element.
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); // el: data, cardsHtml: new array. 5. cardsHtml will replace an array with the five final HTMLs, each for one of the five cards.
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html', }); 
        const prodcut = dataObj[query.id]; 
        const output = replaceTemplate(tempProduct, prodcut);
        
        res.end(output);

    // API
    } else if (pathname === '/api'){
        // read the file 
          res.writeHead(200, {'Content-type': 'application/json'}); 
          res.end(data);   
    
    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html', 
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>')
    }
});

server.listen(8000, () => {
    console.log("Server listening to requests on port 8000");
    
});