
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'mediamarkt',
    domain: 'mediamarkt.at',
    loadedSelector: 'div[class^="ProductDetailPagestyled"] div[data-test="mms-select-details-header"]',
    noResultsXPath: '//div[contains(@class, "ErrorPage")]',
    zipcode: '',
  },
};
