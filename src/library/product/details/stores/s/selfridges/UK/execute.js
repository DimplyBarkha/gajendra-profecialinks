
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    loadedSelector: 'section[data-js-component="productHero"]',
    noResultsXPath: "//div[@class='component-content']//p[contains(text(), 'We can't seem to find any results for')]",
    zipcode: '',
  },
};
