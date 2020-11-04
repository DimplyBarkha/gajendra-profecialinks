const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'officedepot',
    transform,
    domain: 'officedepot.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      const sectionsDiv = '[data-test="gallery-thumbnail-wrap"] [data-test="img-zoom-wrap"]';
      await context.waitForSelector(sectionsDiv, { timeout: 30000 });
    } catch (error) {
      console.log("couldn't find the selector due to - " + error.message);
    }
    await context.evaluate(async function () {
      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await timeout(10000);
      const getDescription = async function () {
        let text = '';
        [...document.querySelector('.sku_desc').children].forEach(item => {
          if (item.nodeName === 'UL') {
            [...item.children].forEach(val => {
              text += ` || ${val.textContent}`;
            });
          } else {
            text += `${item.textContent}`;
          }
          document.body.setAttribute('desc', `${text.replace(/\s{2,}/g, ' ')}`);
        });
      };
      if (document.querySelector('.sku_desc')) {
        await getDescription();
      }
      await timeout(10000);
      const value = document.querySelector('div.wc-video-gallery > iframe#wcframable1-0') ? document.querySelector('div.wc-video-gallery > iframe') : '';
      if (value !== '') {
        var doc = value.contentDocument;
        document.head.setAttribute('video', doc.body.querySelector('video').getAttribute('src'));
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
