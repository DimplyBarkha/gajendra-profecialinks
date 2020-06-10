async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;

  let extendedId = id.toString().split('');

  while (extendedId.length < 13) {
    extendedId.unshift('0');
  }

  extendedId = extendedId.join('');

  return `https://www.kroger.com/search?query=${extendedId}&searchType=natural&fulfillment=all`;
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'kroger.com',
    prefix: null,
    country: 'US',
    store: 'kroger',
  },
  implementation,
};
