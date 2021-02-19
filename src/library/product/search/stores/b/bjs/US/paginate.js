
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bjs',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//*[contains(text(),"we found 0 matches")]',
    openSearchDefinition: {
      
      template: 'https://www.bjs.com/search/{searchTerms}/q?pagenumber={page}',
    },
    domain: 'bjs.com',
    zipcode: '',
  },
};
