
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes_lg',
    nextLinkSelector: 'ul[data-selector="splp-pag-lst"] li:last-child a:not(.disabled)',
    mutationSelector: 'div.plt div[data-selector="splp-prd-lst-ttl"]',
    spinnerSelector: null,
    loadedSelector: 'a > span > article > span',
    noResultsXPath: '//h1[contains(text(),"NO RESULTS FOUND FOR")]',
    openSearchDefinition: null,
    domain: 'lowes.com',
    zipcode: '',
  },
};
