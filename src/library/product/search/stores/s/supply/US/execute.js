
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'supply',
    domain: 'supply.com',
    url: 'https://www.supply.com/search?terms={searchTerms}',
    loadedSelector: 'div[class="w-100 mb3 flex flex-column flex-row-l flex-wrap-l justify-between"]',
    noResultsXPath: '//div[@class="pr3 stymie large _1Wa5W"]',
    zipcode: '',
  },
};
