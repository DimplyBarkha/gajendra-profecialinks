const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'gigantti',
    transform,
    domain: 'gigantti.fi',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const btn = await context.evaluate(() => { return Boolean(document.querySelector('button.coi-banner__accept')); });
    if (btn) {
      try {
        await context.click('button.coi-banner__accept');
      } catch (error) { }
    }
    if (btn) {
      await context.evaluate(async function () {
        document.querySelector('button.coi-banner__accept').click();
      });
    }
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
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

    await context.evaluate(async function () {
      const overlay = document.getElementById('tab-more-info-trigger');
      if (overlay !== undefined) {
        overlay.click();
      }
    });

    await context.evaluate(async function () {
      const overlay = document.getElementById('tab-specs-trigger');
      if (overlay !== undefined) {
        overlay.click();
      }
    });
    try {
      await context.waitForSelector('iframe.videoly-box', { timeout: 65000 });
    } catch (error) {
      console.log('No video ');
    }

    await context.evaluate(async function () {
      /*       const overlay = document.getElementById('tab-specs-trigger');
            if (overlay !== undefined) {
              overlay.click();
            }
            const overlay1 = document.getElementById('tab-more-info-trigger');
            if (overlay1 !== undefined) {
              overlay1.click();
            } */

      const btn = Boolean(document.querySelector('button.coi-banner__accept'));
      if (btn) {
        try {
          await context.click('button.coi-banner__accept');
        } catch (error) { }
      }

      if (btn) {
        document.querySelector('button.coi-banner__accept').click();
      }

      const videoData = document.querySelectorAll('iframe.videoly-box').length ? document.querySelectorAll('iframe.videoly-box')[0].contentWindow.document.getElementsByTagName('ul')[0] : null;

      if (videoData) {
        document.body.appendChild(videoData);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
