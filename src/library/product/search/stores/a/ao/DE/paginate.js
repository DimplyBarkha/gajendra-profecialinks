
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    nextLinkSelector: 'i.ico.ico-chevron-right.ico-lg.text-cta-action',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#body,main.lister,div#contentholder,div#container',
    noResultsXPath: '//div[@class="no-results "] | //div[@id="categoryPage"] | //section[@id="productInformation"]',
    openSearchDefinition: null,
    domain: 'ao.de',
    zipcode: '',
  },
};
