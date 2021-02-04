
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'maquillalia',
    domain: 'maquillalia.com',
    url: "https://www.maquillalia.com/search.php?buscar={searchTerms}",
    // loadedSelector: "main.Container",
    loadedSelector: null,
    // loadedXpath: '//div[@class="ListProds BX Row Cols B03 Sp0"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
