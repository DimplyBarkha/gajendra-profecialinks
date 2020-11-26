const { transform } = require('./variantsFormat');

/**
 *
 * @param { { url: any, id: any } } inputs
 * @param { { country: any, transform: any, store: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async function () {
    const canonicalUrl = document.querySelector('link[rel="canonical"]').getAttribute('href');
    const allBlocks = document.querySelector('div.productdetail-radio div.sky-form__radio') ? document.querySelectorAll('div.productdetail-radio div.sky-form__radio') : [];
    allBlocks.forEach((block, index) => {
      const div = document.createElement('div');
      div.id = 'product_page_url';
      div.innerHTML = canonicalUrl;
      block.appendChild(div);
      console.log(block);
    });
  });

  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'linsenmax',
    transform,
    domain: 'linsenmax.ch',
    zipcode: '',
  },
  implementation,
};
