
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    nextLinkSelector: 'a.arrow.false[aria-label="arrow right"]',
    mutationSelector: 'div.plt div[data-selector="splp-prd-lst-ttl"]',
    spinnerSelector: null,
    loadedSelector: 'a > span > article > span',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")]',
    openSearchDefinition: null,
    domain: 'lowes.com',
    zipcode: '',
  },
};
