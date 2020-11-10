
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'cocooncenter',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section#listing',
    noResultsXPath: '//div[@id="msg_erreur_listing"]',
    openSearchDefinition: null,
    domain: 'cocooncenter.com',
    zipcode: "''",
  },
};
