
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    domain: 'citilink.ru',
    url: 'https://www.citilink.ru/search/?text={searchTerms}',
    loadedSelector: 'div.product_category_list div',
    noResultsXPath: '//h2[contains(text(), "По Вашему запросу")]',
    zipcode: '',
  },
};
