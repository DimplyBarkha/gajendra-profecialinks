
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ae',
    store: 'choithrams',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class="products-list"]',
    noResultsXPath: '//section[@class="products-list"]//div[contains(.,"No products")]',
    openSearchDefinition:
     {
       offset: 0,
       template: 'https://www.choithrams.com/search/?q={searchTerms}&page={page}',
     },
    domain: 'choithrams.com',
    zipcode: '',
  },
};
