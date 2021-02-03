module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    domain: 'walgreens.com',
    loadedSelector: 'div#product, h1#productName',
    noResultsXPath: '//div[@name="wag-negative-container"]/div | //h1[contains(@id, "zero-result-alert")]|//span[contains(text(), "This product is no longer available on our site.")]',
  },
};
