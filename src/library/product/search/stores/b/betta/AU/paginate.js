
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'betta',
    nextLinkSelector: 'div#instant-search-results-container > div > div.ais-infinite-hits--showmore > button',
    loadedSelector: 'div.ais-infinite-hits',
    domain: 'betta.com.au',
    zipcode: '',
  },
};
