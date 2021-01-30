const { transform } = require('./variantFormat');
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
    country: 'CA',
    store: 'thebay',
    transform,
    domain: 'thebay.com',
    zipcode: "''",
  },
  implementation
};
