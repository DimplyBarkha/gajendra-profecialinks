
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'shufersal',
    domain: 'shufersal.co.il',
    url: 'https://www.shufersal.co.il/online/he/search?text={searchTerms}',
    loadedSelector: 'div#wrapper.wrapper',
    noResultsXPath: null,
    zipcode: '',
  },
};
