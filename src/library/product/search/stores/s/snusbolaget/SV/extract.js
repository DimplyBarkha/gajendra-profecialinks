async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    while (document.querySelector('a[data-action="get-more-products"]')) {
      document.querySelector('a[data-action="get-more-products"]').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 500));
      if (!document.querySelector('a[data-action="get-more-products"]')) {
        break;
      }
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SV',
    store: 'snusbolaget',
    transform: null,
    domain: 'snusbolaget.se',
    zipcode: '',
  },
  implementation,
};
