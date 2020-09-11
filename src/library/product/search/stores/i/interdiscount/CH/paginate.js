
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount',
    nextLinkSelector: 'li[class="l-Be8I"]:last-child a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section .ulvVbt > div:nth-last-child(2) img',
    noResultsXPath: '//h1[contains(text(),"Ihre Suche nach")]',
    openSearchDefinition: null,
    domain: 'interdiscount.ch',
    zipcode: '',
  },
};
