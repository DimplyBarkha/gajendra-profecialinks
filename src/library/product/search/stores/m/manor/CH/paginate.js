
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    nextLinkSelector: 'div.epoq_changepage.m-page-selection-pagination ul.pagination li.pagination-next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.js-product-tile',
    noResultsXPath: "//div[contains(@class,'item_container')]//p[contains(text(),'Leider konnten wir kein Ergebnis für Sie finden')]",    
    openSearchDefinition: null,
    domain: 'manor.ch',
    zipcode: "''",    
  },
};
