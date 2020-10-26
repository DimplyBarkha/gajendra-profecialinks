
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'riverbendhome',
    domain: 'riverbendhome.com',
    url: 'https://riverbendhome.com/search?searchInput={searchTerms}&search=',
    loadedSelector: 'div#hawkitemlist',
    noResultsXPath: '//div[@id="hawkitemlist" and contains(.,"Search was unable to find any results")]',
    zipcode: "''",
  },
};
