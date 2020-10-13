async function implementation(
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('Extracting data.');
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'courir',
    transform: null,
    domain: 'courir.com',
    zipcode: '',
  },
  implementation,
};
