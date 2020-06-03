
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    domain: 'cvs.com',
    url: 'https://www.cvs.com/search?searchTerm={searchTerms}',
    loadedSelector: 'div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7',
    noResultsXPath: '//div[contains(@class,"css-1dbjc4n r-ymttw5")]/h4[contains(.,"Sorry")]',
  },
};
