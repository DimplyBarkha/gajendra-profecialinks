module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "instacart_costco",
    domain: "instacart.com",
    url: "https://www.instacart.com/store/costco/search_v3/{searchTerms}",
    loadedSelector: ".rmq-926ae505.rmq-6898c4bf.item-card div a",
    noResultsXPath: null,
    zipcode: "",
  },
};
