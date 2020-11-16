
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'nutricaototal',
    nextLinkSelector: "div[class='tollbar-bottom'] div[class='pages'] ul[class='items pages-items'] li[class='item pages-item-next'] a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'nutricaototal.com.br',
    zipcode: '',
  },
};
