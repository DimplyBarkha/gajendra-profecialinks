
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    nextLinkSelector: 'li a[aria-label="arrow right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'a > span > article > span',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")]',
    openSearchDefinition: null,
    domain: 'lowes.com',
    zipcode: '',
  },
};
