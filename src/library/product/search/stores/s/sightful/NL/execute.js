
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'sightful',
    domain: 'sightful.nl',
    url: 'https://www.sightful.nl/{searchTerms}',
    loadedSelector: 'div#amasty-shopby-product-list',
    noResultsXPath: null,
    zipcode: "''",
  },
};
