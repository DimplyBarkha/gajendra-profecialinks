async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode } = inputs;
}

module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'CA',
    domain: 'renodepot.com',
    store: 'reno-depot',
  },
  implementation,
};
