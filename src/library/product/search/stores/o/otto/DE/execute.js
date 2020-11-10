
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    domain: 'otto.de',
    url: "https://www.otto.de/suche/{searchTerms}/",
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
