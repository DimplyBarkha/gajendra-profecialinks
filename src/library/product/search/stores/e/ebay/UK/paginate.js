
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'ebay',
    nextLinkSelector: 'div[class="tppng"]>div[class="wp"] > a:last-of-type[href*="pgn"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class=tpgv]',
    noResultsXPath: '//div[contains(@class, "tprs") and not(descendant::div[contains(@class, "tpgv")])]',
    openSearchDefinition: null,
    domain: 'ebay.co.uk',
    zipcode: '',
  },
};
