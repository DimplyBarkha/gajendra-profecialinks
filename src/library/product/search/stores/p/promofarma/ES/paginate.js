
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'promofarma',
    // nextLinkSelector: '#pagnNextString, #pagnNextLink, ul[class="pagination justify-content-center"] li[class="page-item active "]+li a ',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//div[@class='box-white not-found-box mb-2']",
    openSearchDefinition: {
      template: 'https://www.promofarma.com/es/search?q={searchTerms}&page={page}',
    },
    domain: 'promofarma.com',
    zipcode: '',
  },
};
