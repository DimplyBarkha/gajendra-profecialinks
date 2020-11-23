
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    url: {
      indexOffset: 0,
      template: 'https://allegro.pl/listing?string={searchTerms}&p={startIndex}',
    },
    loadedSelector: 'div.opbox-listing',
    domain: 'allegro.pl',
  },
};
