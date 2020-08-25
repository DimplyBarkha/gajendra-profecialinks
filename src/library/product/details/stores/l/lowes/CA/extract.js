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
      await context.click('button[aria-label="Close"]');
    } catch (error) {
      console.log('No Pop up was present');
    }
    try {
      await context.waitForSelector('div[id="product-manufacturer-content"]:nth-child(2)');
    } catch (error) {
      console.log('No manufacturer description was present.');
    }
    try {
      await context.waitForXPath('//section[@class="product-specifications"]//table//tr');
    } catch (error) {
      console.log('specifications noy loaded.');
    }
    return await context.extract(productDetails, { transform });
  },
};
