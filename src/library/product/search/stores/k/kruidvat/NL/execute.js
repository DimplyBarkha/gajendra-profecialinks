
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    domain: 'kruidvat.nl',
<<<<<<< HEAD
    url: 'https://www.kruidvat.nl/search?q=48+uur+werking&text=48+uur+werking&searchType=manual',
    // url: 'https://www.kruidvat.nl/search?q={searchTerms}&text={searchTerms}&searchType=manual',
    loadedSelector: 'body',
    noResultsXPath: null,
=======
    url: 'https://www.kruidvat.nl/search?q={searchTerms}&searchType=manual&size=20',
    loadedSelector: 'div.product__list-container > div > article',
>>>>>>> 839d23caab0500f410ce46c0090b7c5d4fb7f0ee
    zipcode: '',
  },
};
