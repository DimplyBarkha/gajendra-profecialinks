
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'hair-gallery',
    domain: 'hair-gallery.it',
    url: 'https://www.hair-gallery.it/index.php?route=product/search&search={searchTerms}&description=true&category=true&sub_category=true',
    loadedSelector: 'div.product-grid div.product-block',
    noResultsXPath: '//div[@class="content" and contains(.,"Non ci sono prodotti che soddisfino i criteri di ricerca.")]',
    zipcode: "''",
  },
};
