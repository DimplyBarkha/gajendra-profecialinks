
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    domain: 'citilink.ru',
    url: 'https://www.citilink.ru/search/?text={searchTerms}',
    loadedSelector: 'div.ProductCardCategoryList__grid-container',
    noResultsXPath: '//h1[contains(text(),"По Вашему запросу")]',
    zipcode: '',
  },
};
