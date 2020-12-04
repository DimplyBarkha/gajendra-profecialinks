
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CZ',
    store: 'pilulka',
    domain: 'pilulka.cz',
    loadedSelector: 'div.product-detail__images img[loading]',
    noResultsXPath: '//h1[contains(text(), "404")]',
    zipcode: '',
  },
};
