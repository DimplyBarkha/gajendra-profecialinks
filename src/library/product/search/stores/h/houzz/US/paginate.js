module.exports = {
  implements: "product/search/paginate",
  parameterValues: {
    country: "US",
    store: "houzz",
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    // "#hz-br__result-set-root > div.hz-card.clearfix.hz-br__result-set > div:nth-child(3) > div > div",
    noResultsXPath: null,
    openSearchDefinition: null,
    // {
    //   template:
    //     // "https://www.houzz.com/products/query/{rug}/nqrwns/p/{108}?oq={rug}",
    //     null,
    // },
    domain: "houzz.com",
    zipcode: "",
  },
};

// "https://www.houzz.com/products/query/{searchTerms}/nqrwns/p/{page}?oq={searchTerms}",
