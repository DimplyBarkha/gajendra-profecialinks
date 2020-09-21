
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    domain: 'expertonline.it',
    loadedSelector: 'div[itemprop="mainContentOfPage"]',
    noResultsXPath: '//h2[@class="SchedaNomeProdotto"]',
    zipcode: '',
  },
};
