
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    domain: 'kruidvat.nl',
    url: 'https://www.kruidvat.nl/search?q={searchTerms}&searchType=manual&size=20',
    loadedSelector: 'div.product__list-container > div > article',
    zipcode: '',
  },
};
