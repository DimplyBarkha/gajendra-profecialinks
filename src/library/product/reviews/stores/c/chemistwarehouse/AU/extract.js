const { transform } = require('./../shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistwarehouse',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  await context.setUseRelayProxy(false);
  await context.evaluate(() => {
    const btnClick = document.querySelector('div.eupopup-buttons a');
    if (btnClick) {
      // @ts-ignore
      btnClick.click();
    }
  });

  await context.waitForSelector('#BVRRContainer', { timeout: 10000 });
  await context.evaluate(() => {
    if (!document.getElementById('siteUrl')) {
      const url = window.location.href;
      var divElement = document.createElement('Div');
      divElement.id = 'siteUrl';
      divElement.innerText = url;
      document.getElementById('BVRRContainer').appendChild(divElement);
    }
  });

  let nextLinkSelector = await context.evaluate(
    () =>
      !!document.querySelector(
        'div[class*="bv-content-pagination"] div[class*="bv-content-pagination-container"] ul li[class*="bv-content-pagination-buttons-item-next"] *[class*="bv-content-btn-pages-active"]',
      ),
  );

  let count = 0;
  while (nextLinkSelector) {
    count += await context.evaluate(() => {
      return document.querySelectorAll(
        'div#BVRRContainer ol.bv-content-list.bv-content-list-reviews li',
      ).length;
    });

    if (count <= 190) {
      await context.extract(productReviews, { transform }, { type: 'APPEND' });
      await context.click(
        'div[class*="bv-content-pagination"] div[class*="bv-content-pagination-container"] ul li[class*="bv-content-pagination-buttons-item-next"] *[class*="bv-content-btn-pages-active"]',
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      nextLinkSelector = await context.evaluate(
        () =>
          !!document.querySelector(
            'div[class*="bv-content-pagination"] div[class*="bv-content-pagination-container"] ul li[class*="bv-content-pagination-buttons-item-next"] *[class*="bv-content-btn-pages-active"]',
          ),
      );
    } else {
      break;
    }
  }
  return await context.extract(productReviews, { transform });
}