
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    domain: 'bcc.nl',
    url: 'https://www.bcc.nl/search?search={searchTerms}',
    loadedSelector: 'div.productlist',
    noResultsXPath: '//h1[contains(@class, "contentpage__title")]',
    zipcode: '',
  },
};
