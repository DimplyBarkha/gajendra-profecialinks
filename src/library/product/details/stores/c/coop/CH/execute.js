
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'coop',
    domain: 'coop.ch',
    loadedSelector: 'h1[data-testauto="producttitle"]',
    noResultsXPath: '//div[contains(@class,"errorPanel")]//h1[@class="errorPanel__title"]',
    zipcode: "''",
  },
};
