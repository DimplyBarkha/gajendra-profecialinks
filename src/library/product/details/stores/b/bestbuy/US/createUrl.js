async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  if (id.includes('-')) {
    const gotoUrl = `https://www.bestbuy.com/site/combo/${id}?intl=nosplash`;
    return gotoUrl;
  } else {
    const gotoUrl = `https://www.bestbuy.com/site/${id}.p?intl=nosplash`;
    return gotoUrl;
  }
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'bestbuy.com',
    prefix: null,
    url: null,
    country: 'US',
    store: 'bestbuy',
    zipcode: '',
  },
  implementation,
};
