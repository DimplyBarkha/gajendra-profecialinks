
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    nextLinkSelector: "ul[class='pagination-container'] li[class='pagination-next'] a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'myntra.com',
    zipcode: '',
  },
};
