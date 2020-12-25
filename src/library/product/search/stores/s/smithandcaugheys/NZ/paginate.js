
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'smithandcaugheys',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.products article[data-productid]',
    noResultsXPath: '//div[contains(text(),"Sorry no results found")] | //section[@id="ProductDisplay"]',
    openSearchDefinition: null,
    domain: 'smithandcaugheys.co.nz',
    zipcode: '',
  },
};
