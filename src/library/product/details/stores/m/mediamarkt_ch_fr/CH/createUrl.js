
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'mediamarkt.ch',
    prefix: null,
    url: 'https://www.mediamarkt.ch/fr/product/-{id}.html?ga_query={id}',
    country: 'CH',
    store: 'mediamarkt_ch_fr',
    zipcode: "''",
  },
};