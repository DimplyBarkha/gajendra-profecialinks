
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RS',
    store: 'maxi',
    domain: 'maxi.rs',
    url: 'https://www.maxi.rs/online/search?q={searchTerms}',
    // loadedSelector: 'div.ak6cwf-7 erXDfJ',
    // noResultsXPath: '//p/span',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
