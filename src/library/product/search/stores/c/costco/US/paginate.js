
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'costco',
    nextLinkSelector: 'li.forward > a i',
    // mutationSelector: null,
    // spinnerSelector: null,
    loadedSelector: 'div.product-list',
    noResultsXPath: '//h1[contains(text(),"Try another search")]',
    // openSearchDefinition: null,
    domain: 'costco.com',
    zipcode: '',
  },
};
