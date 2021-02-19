
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'electrocity',
    domain: 'electrocity.ie',
    url: 'https://www.electrocity.ie/?s={searchTerms}&post_type=product&dgwt_wcas=1',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
