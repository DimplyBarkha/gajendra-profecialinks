
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    domain: 'appliancesonline.com.au',
    store: 'appliancesonline',
    url: 'https://www.appliancesonline.com.au/search/{searchTerms}',
    loadedSelector: 'div.grid-container-flex',
    noResultsXPath: '//div[@class="no-filter"]',
  },
};
