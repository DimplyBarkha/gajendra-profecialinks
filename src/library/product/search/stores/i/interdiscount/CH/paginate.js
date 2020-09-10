
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount',
    nextLinkSelector: 'li[class="l-Be8I"]:last-child a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="ulvVbt _1GNlFj"],div[class="_2K5zWg"]',
    noResultsXPath: '//h1[contains(text(),"Ihre Suche nach")]',
    openSearchDefinition: null,
    domain: 'interdiscount.ch',
    zipcode: '',
  },
};
