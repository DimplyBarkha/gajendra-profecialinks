
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'crateandbarrel',
    domain: 'crateandbarrel.com',
    url: 'https://www.crateandbarrel.com/search?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(), "Oops")]',
    zipcode: '',
  },
};
