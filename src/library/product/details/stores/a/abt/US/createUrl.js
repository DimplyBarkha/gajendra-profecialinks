
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'abt.com',
    prefix: null,
    url: "https://www.abt.com/resources/pages/search.php?keywords={id}",
    country: 'US',
    store: 'abt',
    zipcode: '',
  },
};
