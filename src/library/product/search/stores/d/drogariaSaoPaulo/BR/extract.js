const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async() => {
    for (let i = 0; i < 3; i++) {
      try {
        const nextLink = document.querySelector('div.btn-load-more button.btn-primary');
        if (nextLink) {
          console.log('nextLink is not null', nextLink);
          nextLink.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        }
      } catch (err) {}
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'drogariaSaoPaulo',
    transform: transform,
    domain: 'drogariasaopaulo.com.br',
    zipcode: '',
  },
  implementation,
};
