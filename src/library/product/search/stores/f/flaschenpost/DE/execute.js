
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    domain: 'flaschenpost.de',
    url: "https://www.flaschenpost.de/katalog/suche/?searchTerm={searchTerms}",
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="fp-productList_content"]//span[contains(text(),"ergab leider keine Treffer")]',
    zipcode: '28199',
  },
};
