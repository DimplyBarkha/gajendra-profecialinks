module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    nextLinkSelector: 'a.arrow > i.fa-angle-right',
    mutationSelector: null,
    spinnerSelector: 'div.btLoader-overlay',
    loadedSelector: 'div[class*="widget-Hyperlink"]',
    noResultsXPath: '//img[contains(@alt, "Keine Suchergebnisse")]',
    openSearchDefinition: null,
    domain: 'expert.de',
    zipcode: '',
  },
};
