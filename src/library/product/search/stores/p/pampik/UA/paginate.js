
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UA',
    store: 'pampik',
    nextLinkSelector: "div[id='pagination-block'] ul[class='pagination'] li[class='pagination__page current disabled'] + li a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'pampik.com',
    zipcode: '',
  },
};
