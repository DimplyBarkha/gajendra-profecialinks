
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    nextLinkSelector: 'div[id="content-container"]>main>div>div>div>button[type="button"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@id="content-container"]',
    openSearchDefinition: null,
    domain: 'alloffice.se',
    zipcode: '',
  },
};
