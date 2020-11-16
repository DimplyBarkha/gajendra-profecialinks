//const { implementation } = require('../shared');
const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    transform,
    domain: 'ebay.es',
    zipcode: '',
  },
  //implementation,
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.waitForSelector('iframe#desc_ifr');
    } catch (err) {
      console.log('manufacturer contents not loaded or unavailable');
    }
    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('iframe#desc_ifr');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      return src;
    });
    await context.extract(productDetails, { transform });
    if (src) {
      try {
        await context.setBypassCSP(true);
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div#ds_div');
        await context.evaluate(async function () {
          let xpath = '//label[@class="video"]/@data-title';
          let video = document.evaluate(xpath, document).iterateNext().textContent;

          // function to append the elements to DOM
          function addElementToDocument(key, value) {
            const catElement = document.createElement('div');
            catElement.id = key;
            catElement.textContent = value;
            catElement.style.display = 'none';
            document.body.appendChild(catElement);
          }

          addElementToDocument('videoUrl', video);
        });
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (error) {
        try {
          await context.setBypassCSP(true);
          await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
          await context.waitForSelector('div#ds_div');
          await context.evaluate(async function () {
            let xpath = '//label[@class="video"]/@data-title';
            let video = document.evaluate(xpath, document).iterateNext().textContent;

            // function to append the elements to DOM
            function addElementToDocument(key, value) {
              const catElement = document.createElement('div');
              catElement.id = key;
              catElement.textContent = value;
              catElement.style.display = 'none';
              document.body.appendChild(catElement);
            }

            addElementToDocument('videoUrl', video);
          });
          return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
        } catch (error) {
          console.log('could not load page', error);
        }
      }
    }
  }
};
