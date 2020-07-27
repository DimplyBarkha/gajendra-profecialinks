
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonMsCategory',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/gp/bestsellers/{searchTerms}',
    loadedSelector: '//img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol[@id="zg-ordered-list"]/li)]',
    noResultsXPath: null,
  },
};
