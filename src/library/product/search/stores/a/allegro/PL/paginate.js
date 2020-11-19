
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    loadedSelector: 'section > article[data-item]',
    url: {
      indexOffset: 0,
      template: 'https://allegro.pl/listing?string={searchTerms}&p={startIndex}',
    },
    domain: 'allegro.pl',
    zipcode: '',
  },
};
