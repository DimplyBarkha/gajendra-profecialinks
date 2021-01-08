
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'snipes',
    // nextLinkSelector: 'a[class="f-button f-button--primary js-show-more-products"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="b-product-grid js-product-grid"]',
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.snipes.com/search?q={searchTerms}&lang=de_DE&sz=all',
    // },
    domain: 'snipes.com',
    zipcode: '',
  },
};
