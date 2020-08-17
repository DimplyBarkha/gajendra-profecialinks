async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    transform: null,
    domain: 'thebay.com',
    zipcode: '',
  },
  implementation,
};
