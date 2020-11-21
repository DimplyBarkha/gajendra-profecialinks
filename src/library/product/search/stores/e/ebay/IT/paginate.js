module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "IT",
    store: "ebay",
    loadedSelector: "ul.srp-results",
    nextLinkSelector: "a.pagination__next",
    domain: "ebay.it",
  },
};
