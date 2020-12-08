const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
  mergeType,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const mergeOptions = mergeType ? { transform, type: mergeType } : { transform };
  await context.evaluate(function () {
    document.querySelector('footer [class="footerAwards__title"]').scrollIntoView({
      behavior: 'smooth',
    });
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  return await context.extract(productDetails, mergeOptions);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'neonet',
    transform: transform,
    implementation: implementation,
    domain: 'neonet.pl',
    zipcode: '',
    mergeType: 'MERGE_ROWS',
  },
};
