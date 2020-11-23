
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'debenhams',
    domain: 'debenhams.com',
    loadedSelector: "div.t-product-details__main-wrapper div.t-product-details__image img[itemprop='image']",
    noResultsXPath: "//div[contains(@class, 't-generic-error')]//h3[contains(@class, 't-generic-error-title')]",
    zipcode: '',
  },
};
