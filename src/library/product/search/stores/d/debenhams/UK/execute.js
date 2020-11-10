
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'debenhams',
    domain: 'debenhams.com',
    url: "https://www.debenhams.com/search/{searchTerms}",
    loadedSelector: "div.t-product-list__container",
    noResultsXPath: "//div[contains(@class, 't-generic-error')]//h3[contains(@class, 't-generic-error-title')]",
    zipcode: '',
  },
};
