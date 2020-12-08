const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform, mergeType } = parameters;
  const { productDetails } = dependencies;

  const mergeOptions = mergeType ? { transform, type: mergeType } : { transform };
  await context.evaluate(function () {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  return await context.extract(productDetails, mergeOptions);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    transform,
    domain: 'neonet.pl',
    zipcode: '',
    mergeType: 'MERGE_ROWS',
  },
  implementation,
};
