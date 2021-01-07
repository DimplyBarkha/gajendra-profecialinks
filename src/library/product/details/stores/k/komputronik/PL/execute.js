
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    domain: 'komputronik.pl',
    loadedSelector: 'div#p-inner',
    noResultsXPath: '//h2[contains(text(),"404")] | //*[@id="products-list"] | //div[@id="rotator"]', // treating redirected page to product listing page or home page as no result',
    zipcode: "''",
  },
};
