
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    nextLinkSelector: 'a.page.next',
    // mutationSelector: null,
    // spinnerSelector: 'div[data-comp="Interstice Loader "]:not([style="display:none"])',
    loadedSelector: 'div.products-grid',
    // noResultsXPath: '//h4[contains(., "no products found")]',
    // openSearchDefinition: null,
    domain: 'sephora.com',
    zipcode: '',
  },
};
