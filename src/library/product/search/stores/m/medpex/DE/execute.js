
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    domain: 'medpex.de',
    url: 'https://www.medpex.de/search.do?q={searchTerms}&pn=1',
    loadedSelector: 'div.product-list-entry.data-tracking-product',
    noResultsXPath: '//div[@id="messageContainer"]/table[@class="error"]',
  },
};
