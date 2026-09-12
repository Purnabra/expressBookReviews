const { asyncApi: { getAllBooks, getbooksbyISBN, getbooksbyauthor, getbooksbytitle } } = require('./router/general');



//getAllBooks().then((data) => { console.log(data) }).catch(err => { console.log(err) });


//getbooksbyISBN(10).then((data) => { console.log(data) }).catch(err => { console.log(err.response.data) });

//getbooksbyauthor('Honor\u00e9 de Balzac').then((data) => { console.log(data) }).catch(err => { console.log(err.response.data) });

getbooksbytitle('Le P\u00e8re Goriot').then((data) => { console.log(data) }).catch(err => { console.log(err.response.data) });