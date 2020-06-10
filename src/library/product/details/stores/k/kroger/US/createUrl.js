async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  const { domain, prefix } = parameters; // eslint-disable-line

  // add leading zeroes if needed
  let extendedId = id.toString().split('');

  while (extendedId.length < 13) {
    extendedId.unshift('0');
    console.log(extendedId);
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
