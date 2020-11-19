
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    nextLinkSelector: 'ul[class*="menu menu--horizontal pagination__menu"] li',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.card__image',
    noResultsXPath: '//div[contains(@class,"assortment-overview__sorting")]//font[contains(text(),"0 products")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'colruyt.be',
    zipcode: '',
  },
};
