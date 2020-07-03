const { amazonTransform } = require('../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform: amazonTransform,
    domain: 'amazon.de',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const isVideoPresent = await context.evaluate(async function () {
    return document.querySelector('li.videoThumbnail');
  });
  if (isVideoPresent) {
    await context.click('li.videoThumbnail');
    await context.waitForSelector('div#main-video-container video');
  }
  return await context.extract(productDetails, { transform });
}
