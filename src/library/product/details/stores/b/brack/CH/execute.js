
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    domain: 'brack.ch',
    loadedSelector: 'div.productStage__infoText',
    noResultsXPath: '//div[contains(@class, "hasNoSearchResults")] | //div[@class="wrapper error-404"]',
    zipcode: '',
  },
};
