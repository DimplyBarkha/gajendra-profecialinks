const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    transform: cleanUp,
    domain: 'alloffice.se',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(() => {
      const rpc = document.querySelector('meta[property="product:retailer_item_id"]').getAttribute('content');
      const imgs = document.querySelectorAll('img');
      const div = document.createElement('div');
      div.setAttribute('id', 'altImages');
      for (let i = 0; i < imgs.length; i++) {
        if ((imgs[i].getAttribute('alt') + ' ').includes(rpc)) {
          const link = 'https://www.alloffice.se' + imgs[i].getAttribute('src');
          imgs[i].setAttribute('src', link.split('&w')[0]);
          div.appendChild(imgs[i]);
        }
      }
      document.querySelector('div[id="container"]').append(div);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
