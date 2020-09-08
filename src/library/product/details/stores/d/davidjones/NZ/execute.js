
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    domain: 'davidjones.com',
    loadedSelector: 'div[itemtype*="http://schema.org/Product"]',
    noResultsXPath: '//h1[contains(text(), "Invalid Request")] | //h1[contains(text(), "Page not found")]',
    zipcode: '',
  },
};
