
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    domain: 'medpex.de',
    url: 'https://www.medpex.de/search.do?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//div[@id="messageContainer"]/table[@class="error"]',
  },
};
