
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'instacart_publix',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#react-views-container > div > div > div > div:nth-child(1) > div > div > div > div',
    noResultsXPath: null,
    // openSearchDefinition: {
    //   offset: 50,
    //   template: 'https://www.instacart.com/store/publix/search_v3/{searchTerms}',
    // },
    domain: 'instacart.com',
    zipcode: '',
  },
};
