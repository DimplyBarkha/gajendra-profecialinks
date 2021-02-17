
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'loblaws',
    domain: 'loblaws.ca',
    url: 'https://www.loblaws.ca/search?search-bar={searchTerms}',
<<<<<<< HEAD
    // loadedSelector: 'li[class="product-tile-group__list__item"]',
    // url: 'https://www.loblaws.ca/search?search-bar=Aero',
=======
    loadedSelector: null,
    noResultsXPath: null,
>>>>>>> 925fa7fbf830ff316326e0a824cce53636541c54
  },
};
