
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    nextLinkSelector: 'div[class*="footer"] div[class="shop-pager"]>a[title="weiter"]>svg',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '*[data-order]',
    noResultsXPath: '//h1[contains(@class,"suchen-null-treffer-headline")]//span/following-sibling::text()["leider nichts finden"]',
    openSearchDefinition: null,
    domain: 'breuninger.de',
    zipcode: '',
  },
};
