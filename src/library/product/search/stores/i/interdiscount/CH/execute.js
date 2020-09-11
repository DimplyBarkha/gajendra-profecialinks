
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount',
    domain: 'interdiscount.ch',
    url: 'https://www.interdiscount.ch/de/search?search={searchTerms}',
    loadedSelector: 'section .ulvVbt > div:nth-last-child(2) img',
    noResultsXPath: '//h1[contains(text(),"Ihre Suche nach")]',
    zipcode: '',
  },
};
