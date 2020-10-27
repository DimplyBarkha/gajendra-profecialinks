module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'thefragranceshop',
    nextLinkSelector: 'li:last-child a.btn-smangle-left',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="product-list"]',
    noResultsXPath: '//div[@class="fnl-landing-noresults"]',
    openSearchDefinition: null,
    domain: 'thefragranceshop.co.uk',
    zipcode: '',
  },
};
