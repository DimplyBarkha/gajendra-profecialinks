const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const videoSelector = document.querySelector('a#panel-product-videos');
    if (videoSelector) {
      // @ts-ignore
      videoSelector.click();
      const videos = document.querySelectorAll('div.info-panel-content.panel-product-videos > iframe');
      if (videos) {
        videos.forEach(element => {
          const videoUrl = element.getAttribute('src');
          document.body.setAttribute('video', videoUrl);
        });
      }
    }
    const specificationSelector = document.querySelector('a#panel-product-specification');
    if (specificationSelector) {
      // @ts-ignore
      specificationSelector.click();
    }
    const overviewSelector = document.querySelector('a#panel-product-overview');
    if (overviewSelector) {
      // @ts-ignore
      overviewSelector.click();
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'did',
    transform: cleanUp,
    domain: 'did.ie',
    zipcode: '',
  },
  implementation,
};
