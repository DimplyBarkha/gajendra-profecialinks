
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    domain: 'lookfantastic.com',
    url: 'https://www.lookfantastic.com/elysium.search?search={searchTerms}&pageNumber=1',
    loadedSelector: "main#mainContent",
    noResultsXPath: '//div[@class="noresults"]',
  },
};
