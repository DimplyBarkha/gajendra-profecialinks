
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'dickssportinggoods',
    domain: 'dickssportinggoods.com',
    url: 'https://www.dickssportinggoods.com/search/SearchDisplay?searchTerm={searchTerms}',
    loadedSelector: ' div.rs_card_container > div.rs_product_card_container.dsg-flex.flex-wrap',
    noResultsXPath: null,
    zipcode: '',
  },
};
