
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'freshamazon',
    loadedXpath: '//div[@class="s-main-slot s-result-list s-search-results sg-row"]/div',
    openSearchDefinition: {
      template: 'https://www.amazon.de/s?k={searchTerms}&i=amazonfresh&bbn=6723195031&page={page}&__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&qid=1608577215',
    },
    domain: 'freshamazon.de',
    zipcode: '',
  },
};
