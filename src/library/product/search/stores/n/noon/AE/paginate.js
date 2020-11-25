module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    nextLinkSelector: 'li.next',
    mutationSelector: null,
    spinnerSelector: 'div.jsx-3230834092 loader',
    loadedSelector: '.productContainer',
    noResultsXPath: '//div/p[contains(text(),"We couldn’t find what you were looking for")]',
    openSearchDefinition: null,
    domain: 'noon.com',
    zipcode: "''",
  },
};
