
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    nextLinkSelector: 'div[class="infinite--actions"] a[class="btn is--primary is--icon-right js--load-more"]',
    mutationSelector: null,
    spinnerSelector: "div[class='js--loading-indicator indicator--relative']",
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'perfecthair.ch',
    zipcode: '',
  },
};
