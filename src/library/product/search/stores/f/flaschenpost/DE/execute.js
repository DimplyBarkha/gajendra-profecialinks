
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    domain: 'flaschenpost.de',
    url: "https://www.flaschenpost.de/Katalog/Suche/?searchTerm={searchTerms}",
    loadedSelector: 'div[class="fp-modal_inner"]',
    noResultsXPath: '//div[@class="fp-productList_content"]/span',
    zipcode: '28203',
  },
};
