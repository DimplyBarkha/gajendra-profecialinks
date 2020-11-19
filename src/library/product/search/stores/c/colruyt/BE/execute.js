
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    domain: 'colruyt.be',
    url: 'https://www.colruyt.be/nl/producten?searchTerm={searchTerms}',
    loadedSelector: 'div.card__image',
    noResultsXPath: '//div[contains(@class,"assortment-overview__sorting")]//font[contains(text(),"0 products")]',
    zipcode: '',
  },
};
