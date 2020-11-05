
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'soundstore',
    domain: 'soundstore.ie',
    url: 'https://www.soundstore.ie/catalogsearch/result/?q="%60{searchTerms}%60"',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
