
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    loadedSelector: 'section > article[data-item] ul>li:nth-child(1)>img',
    url: {
      indexOffset: 0,
      template: 'https://allegro.pl/listing?string={searchTerms}&p={startIndex}',
    },
    domain: 'allegro.pl',
    zipcode: '',
  },
};
