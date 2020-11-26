
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ae',
    store: 'choithrams',
    nextLinkSelector: 'li[class="next"]',
    // 'li[class="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="small-product-box"]',
    // 'div[class="small-product-box"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    //  {
    //    template: 'https://www.choithrams.com/en/shop/search/?q={searchTerms}?page={page}',
    //  },
    domain: 'choithrams.com',
    zipcode: '',
  },
};
