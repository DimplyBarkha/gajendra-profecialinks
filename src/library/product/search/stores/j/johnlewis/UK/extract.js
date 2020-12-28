const { transform } = require('../../../../shared');
const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  async function addProductCode () {
    async function getProductCodeFromUrl (url) {
      const response = await fetch(url);
      const html = await response.text();
      const code = html.match(/(data-product-code=|"code":)"([^"]+)/);
      if (!code) return '';
      return code[2];
    }
    const nodes = Array.from(document.querySelectorAll('a[class^="product-card_c-product-card__link"]'));
    const urls = nodes.map(elm => elm.href);
    const promises = urls.map(url => getProductCodeFromUrl(url));
    const productCodes = await Promise.all(promises);
    await Promise.all(promises);
    for (let index = 0; index < nodes.length; index++) {
      nodes[index].setAttribute('product-code', productCodes[index]);
    }
  }
  await context.evaluate(addProductCode);
  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform: transform,
    domain: 'johnlewis.com',
  },
  implementation,
};
