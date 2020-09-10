
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'technopark',
    domain: 'technopark.ru',
    url: 'https://www.technopark.ru/search/?q={searchTerms}&strategy=vectors_extended,zero_queries',
    loadedSelector: 'div.listing__products-list.listing__products-list--big',
    noResultsXPath: null,
    zipcode: '',
  },
};
