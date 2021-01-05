const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'lowes',
    transform,
    domain: 'lowes.ca',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    try {
      await context.click('button[aria-label="Close"]');
    } catch (error) {
      console.log('No Pop up was present');
    }
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    await context.evaluate(() => {
      function addEleToDoc (key, value, tag) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        tag ? document.body.prepend(prodEle) : document.body.appendChild(prodEle);
      }
      const iFrame = document.querySelector('iframe[title="Product Videos"]');
      if (iFrame) {
        // @ts-ignore
        var finalSrc = iFrame.contentWindow.document.getElementsByTagName('video');
        for (let index = 0; index < finalSrc.length; index++) {
          if (finalSrc[index].src) {
            addEleToDoc('pd_videos', finalSrc[index].src, false);
          }
        }
      }
      // @ts-ignore
      let response = document.querySelector('script[type="application/ld+json"]') && document.querySelector('script[type="application/ld+json"]').innerText;
      if (response) {
        response = JSON.parse(response);
        if (response.aggregateRating) {
          response.aggregateRating.ratingValue && addEleToDoc('pd_aggregate', response.aggregateRating.ratingValue, true);
        }
      }
    });
    try {
      await context.waitForXPath('//li[@id="manufacturer-content-jump"]');
      await context.waitForXPath('//div[@id="product-manufacturer-content"]');
    } catch (error) {
      console.log('specifications noy loaded.');
    }
    try {
      await context.waitForXPath('//section[@class="product-specifications"]//table//tr');
    } catch (error) {
      console.log('specifications not loaded.');
    }
    return await context.extract(productDetails, { transform });
  },
};
