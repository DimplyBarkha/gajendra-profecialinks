
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount',
    domain: 'interdiscount.ch',
    url: 'https://www.interdiscount.ch/de/search?search={searchTerms}',
    loadedSelector: 'div[class="ulvVbt _1GNlFj"],div[class="_2K5zWg"]',
    noResultsXPath: '//h1[contains(text(),"Ihre Suche nach")]',
    zipcode: '',
  },
};
