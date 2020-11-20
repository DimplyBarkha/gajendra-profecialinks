
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IL',
    store: 'victoryonline',
    domain: 'victoryonline.co.il',
    loadedSelector: 'div.ShoppingLayout',
    noResultsXPath: "//div[@id='ListTextContent']",
    zipcode: '',
  },
};
