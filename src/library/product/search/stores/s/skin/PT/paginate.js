module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    // nextLinkSelector: 'a[class="action  next"]',
    // nextLinkSelector: '#maincontent > div.columns > div.column.main > div:nth-child(8) > div.pages > ul > li > a.action.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img[class="product-image-photo"]',
    // loadedSelector: 'ol.products.list.items.product-items',
    // loadedSelector: '#maincontent > div.columns > div.column.main > div.search.results  ol > li > div',
    openSearchDefinition: null,
    domain: 'skin.pt',
    zipcode: '',
  },
};
