
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    domain: 'medpex.de',
    url: 'https://www.medpex.de/search.do?q={searchTerms}',
    loadedSelector: 'div#product-list div.clearfix',
    noResultsXPath: '//div[@id="messageContainer"]/table[@class="error"]',
  },
};
