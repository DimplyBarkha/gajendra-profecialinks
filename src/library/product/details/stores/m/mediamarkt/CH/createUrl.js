
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'mediamarkt.ch/fr',
    prefix: null,
    url: 'https://www.mediamarkt.ch/fr/product/-{id}.html?ga_query={id}',
    country: 'CH',
    store: 'mediamarkt',
    zipcode: "''",
  },
};
