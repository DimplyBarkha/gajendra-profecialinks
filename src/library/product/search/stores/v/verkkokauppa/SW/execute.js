
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SW',
    store: 'verkkokauppa',
    domain: 'verkkokauppa.com',
    url: 'https://www.verkkokauppa.com/fi/search?query={searchTerms}',
    loadedSelector: 'div.sc-1pejwl4-0',
    noResultsXPath: '//section[contains(@class,"zracwc-0 kaKFIU")]',
    zipcode: '',
  },
};
