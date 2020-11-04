
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    domain: 'ah.nl',
    loadedSelector: '[class="lazy-image__image"]',
    noResultsXPath: '//div[contains(@class,"not-found_root")]',
    zipcode: '',
  },
};
