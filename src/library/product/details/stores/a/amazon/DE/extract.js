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
    if (element) {
      await element.click();
    }
  });
  await context.waitForSelector('div#main-video-container video');
  // await context.select('select[name="dropdown_selected_size_name"]', ['1,B07P9722MJ']);

  return await context.extract(productDetails, { transform });
}
