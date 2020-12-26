
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    domain: 'komputronik.pl',
    loadedSelector: 'div#p-inner',
    noResultsXPath: '//h2[contains(text(),"404")] | //*[@id="products-list"]', // treating redirected page to product listing page as no result',
    zipcode: "''",
  },
};
