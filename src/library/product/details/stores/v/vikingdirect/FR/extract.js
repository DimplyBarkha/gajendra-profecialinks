const { cleanUp } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  await context.evaluate(() => {
    const productUrl = window.location.href;

    document.querySelector('div[id="contentContainer"]').setAttribute('producturl', productUrl);
  });

  if (await context.evaluate(() => {
    return document.querySelectorAll('.multiSkuDimensionValues>div')[0];
  }) !== undefined) {
    for (let i = 0; i < await context.evaluate(() => {
      return document.querySelectorAll('.multiSkuDimensionValues>div').length;
    }); i++) {
      await context.evaluate(() => {
        const descriptionSelector = document.querySelector('.skuFullDescContent');
        let description = '';

        descriptionSelector.querySelectorAll('p').forEach(p => {
          description += p.textContent + ' |';
        });

        document.querySelector('div[id="skuFullDesc"]').setAttribute('description', description);
      });

      if (await context.evaluate(() => {
        return document.querySelectorAll('.multiSkuDimensionValues>div')[i + 1];
      }) === undefined) {
        await context.evaluate(() => {
          const descriptionSelector = document.querySelector('.skuFullDescContent');
          let description = '';

          descriptionSelector.querySelectorAll('p').forEach(p => {
            description += p.textContent + ' |';
          });

          document.querySelector('div[id="skuFullDesc"]').setAttribute('description', description);
        });

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
      const descriptionSelector = document.querySelector('.skuFullDescContent');
      let description = '';

      descriptionSelector.querySelectorAll('p').forEach(p => {
        description += p.textContent + ' |';
      });

      document.querySelector('div[id="skuFullDesc"]').setAttribute('description', description);

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
