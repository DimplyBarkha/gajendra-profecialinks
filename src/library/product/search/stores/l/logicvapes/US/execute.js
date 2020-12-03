
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'logicvapes',
    domain: 'logicvapes.us',
    url: 'https://www.logicvapes.us/shop',
    loadedSelector: 'div.products-list-category',
    noResultsXPath: '//p[contains(text(),"page you are looking for doesn\'t exist")]',
    zipcode: '',
  },
};
