
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    nextLinkSelector: 'nav a[href*="page"]:nth-last-child(1)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[style*="flex-grow"] > div.col-12-12:nth-last-child(3)',
    noResultsXPath: '//div[@class="DUFPUZ"]',
    openSearchDefinition: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
};
