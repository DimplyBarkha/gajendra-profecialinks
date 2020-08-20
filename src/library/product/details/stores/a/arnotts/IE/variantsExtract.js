const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IE',
    store: 'arnotts',
    transform,
    domain: 'arnotts.ie',
    zipcode: '',
  },
  implementation,
};
