const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  if (await context.evaluate(() => {
    return document.querySelectorAll('.multiSkuDimensionValues>div')[0];
  }) !== undefined) {
    for (let i = 0; i < await context.evaluate(() => {
      return document.querySelectorAll('.multiSkuDimensionValues>div').length;
    }); i++) {
      if (await context.evaluate(() => {
        return document.querySelectorAll('.multiSkuDimensionValues>div')[i + 1];
      }) === undefined) {
        return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
      }
      await context.evaluate(() => {
        document.querySelectorAll('.multiSkuDimensionValues>div')[i].click();
        i++;
      });

      // wait for extraction
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      await context.extract(productDetails, { transform }, 'MERGE_ROWS');
    }
  } else {
    await context.evaluate(() => {
      const videoSelector = document.querySelectorAll('div[type="video"]');

      if (videoSelector) {
        videoSelector.forEach(video => {
          video.click();
        });
      }
    });

    return await context.extract(productDetails, { transform }, 'MERGE_ROWS');
  };
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    transform: cleanUp,
    domain: 'vikingdirect.fr',
    zipcode: '',
  },
  implementation,
};
