
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'durstexpress',
    nextLinkSelector: "#amasty-shopby-product-list > div:nth-child(3) > div.pages > ul > li.item.pages-item-next > a",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: "body",
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'durstexpress.de',
    zipcode: '',
  },
};
