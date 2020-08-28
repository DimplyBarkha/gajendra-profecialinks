
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    nextLinkSelector: '.pagination li a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.col-tn-6 col-lg-4 galleryItem',
    noResultsXPath: '//h3[contains(.,"Just give these easy tips a try")]',
    openSearchDefinition: null,
    domain: 'qvc.com',
    zipcode: '',
  },
};
