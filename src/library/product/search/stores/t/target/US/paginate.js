
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'target',
    nextLinkSelector: 'a[data-test="next"]',
    loadedSelector: 'div[data-test="productGridContainer"] ul li:nth-last-child(1)',
    noResultsXPath: '//h1[contains(.,"no results found")]',
    domain: 'target.com',
    zipcode: '',
  },
};
