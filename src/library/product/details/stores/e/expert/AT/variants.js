
module.exports = {
  implements: 'product/details/variants',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    domain: 'expert.at',
    url: 'https://www.expert.at/shop/?q={id}&perPage=151',
    noResultsXPath: '//div[contains(@class,"findologic-result") and contains(.,"Keine Ergebnisse für")]',
    zipcode: '',
  },
};
