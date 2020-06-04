async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  // const { domain, prefix } = parameters;
  console.log('creating url...');
  return 'https://www.target.com/s?searchTerm=' + id;
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'target.com',
    prefix: null,
    country: 'us',
    store: 'target',
  },
  implementation,
};
