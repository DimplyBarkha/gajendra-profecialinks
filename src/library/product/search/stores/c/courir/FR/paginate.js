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
    country: 'FR',
    store: 'courir',
    domain: 'courir.com',
  },
  implementation,
};
