
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'prodirectsoccer',
    transform: null,
    domain: 'prodirectsoccer.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;
    try {
      await context.waitForSelector('.js-size-chart-dropdown');
      await context.evaluate(() => {
        const body = document.querySelector('body');
        function createElement (el, text, clsName) {
          const ele = document.createElement(el);
          ele.className = clsName;
          ele.innerText = text;
          body.append(ele);
        }
        // @ts-ignore
        const urls = [...document.querySelectorAll('.size-chart__content div[class*="active"] button')];
        const variants = [];
        const currentUrl = window.location.href;
        let id = currentUrl.split('-');
        // @ts-ignore

        id = id[id.length - 1];
        // @ts-ignore
        const sku = id.split('/')[0];
        urls.forEach(url => {
          const variantUrl = 'https://www.prodirectsoccer.com/p/' + sku + '?variant=' + url.getAttribute('data-variant-id');
          variants.push(variantUrl);
        });
        variants.forEach(variant => {
          createElement('div', variant, 'variants-url');
        });
      });
    } catch (e) {
      console.log('No such product exits or it doesnot have variants');
    }
    return await context.extract(variants, { transform });
  },
};
