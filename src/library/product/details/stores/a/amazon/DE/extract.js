module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform: null,
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
  await context.evaluate(async function () {
    const element = document.querySelector('li.videoThumbnail');
    // let videoLink = '';
    if (element) {
      await element.click();
      // videoLink = document.querySelector('div#main-video-container video');
      // videoLink = videoLink.getAttribute('src');
    }
  });
  await context.waitForSelector('div#main-video-container video');
  return await context.extract(productDetails, { transform });
}
