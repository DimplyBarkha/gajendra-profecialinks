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
    const window = document.querySelector('div[class*="QSIWebResponsiveDialog-Layout1-SI_9WvVJ37XGlhRADb_content"]');
    if (popUp) popUp.remove();
    if (window) window.remove();
  });
  const data = await context.extract(productDetails, { transform });
  for (let i = 0; i < data[0].group.length; i++) {
    if ('aggregateRating2' in data[0].group[i]) {
      data[0].group[i].aggregateRating2[0].text = data[0].group[i].aggregateRating2[0].text.split(' ')[0];
    }
  }
  return data;
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
