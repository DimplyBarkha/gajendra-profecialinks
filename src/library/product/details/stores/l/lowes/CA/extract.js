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
      await new Promise(resolve => setTimeout(resolve, 2814));
      const element = document.getElementById('product-manufacturer-content');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 2197));
      }
    });
    await context.evaluate(() => {
      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
      const iFrame = document.querySelector('iframe[title="Product Videos"]');
      if (iFrame) {
        var finalSrc = iFrame.contentWindow.document.getElementsByTagName('video');
        for (let index = 0; index < finalSrc.length; index++) {
          if (finalSrc[index].src) {
            addEleToDoc('pd_videos', finalSrc[index].src);
          }
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
