module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    domain: 'adorebeauty.com.au',
    loadedSelector: 'section.product-main',
    noResultsXPath: "//h1[contains(text(), 'Sorry but we couldn't find the page')]",
    zipcode: '',
  },
};
