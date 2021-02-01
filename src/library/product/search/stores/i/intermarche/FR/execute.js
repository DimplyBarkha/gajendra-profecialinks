module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "FR",
    store: "intermarche",
    domain: "intermarche.com",
    url:
      "https://www.intermarche.com/rechercheproduits/11770/recherche/{searchTerms}",
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: "",
  },
};
