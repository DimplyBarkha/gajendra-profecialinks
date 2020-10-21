
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    url: 'https://www.selfridges.com/GB/en/cat/?freeText={searchTerms}&srch=Y',
    loadedSelector: '.listing-items.c-listing-items.initialized',
    noResultsXPath: '//div[@class="component-content"]//div[@class="richText-content"]//span[@class="bigger"]//strong//text()',
    zipcode: '',
  },
};
