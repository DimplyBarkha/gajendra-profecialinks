
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'logicvapes',
    domain: 'logicvapes.us',
    loadedSelector: 'section#product-page',
    noResultsXPath: '//p[contains(text(),"page you are looking for doesn\'t exist")]',
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
};
