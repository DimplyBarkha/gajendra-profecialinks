const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await context.evaluate(async () => {
    const popUp = document.querySelector('div.fancybox-skin');
    if (popUp) popUp.remove();
  });

  await context.evaluate(async () => {
    for (let i = 0; i <= document.body.scrollHeight; i = i + 500) {
      window.scroll(0, i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    transform: transform,
    domain: 'qvc.com',
    zipcode: '',
  },
  implementation,
};
