
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'amazon.de',
    prefix: null,
    url: null,
    country: 'DE',
    store: 'amazon',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('URL+++' + `https://www.amazon.de/dp/${inputs.id}`);
  return `https://www.amazon.de/dp/${inputs.id}`;
  // TODO: Check for not found?
}
