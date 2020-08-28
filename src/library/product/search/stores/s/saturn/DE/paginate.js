
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  return false;
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'saturn',
    domain: 'saturn.de',
  },
  implementation,
};
