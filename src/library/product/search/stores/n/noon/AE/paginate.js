module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    nextLinkSelector: 'li.next',
    mutationSelector: null,
    spinnerSelector: 'div.jsx-3230834092 loader',
    loadedSelector: 'div.jsx-3152181095 .productList .gridView',
    noResultsXPath:  '//div[@class="jsx-671104679 jsx-3349621030 container"]',
    openSearchDefinition: null,
    domain: 'noon.com',
    zipcode: "''",
  },
};
