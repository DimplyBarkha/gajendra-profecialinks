
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'abt',
    domain: 'abt.com',
    url: 'https://www.abt.com/resources/pages/search.php?keywords=%22{searchTerms}%22',
    loadedSelector: 'div#category_results',
    noResultsXPath: '//h2[@class="nopagetext"]',
    zipcode: '',
  },
};
