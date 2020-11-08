const{transform} = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForSelector('.cookies-overlay-dialog__accept-all-btn', { timeout: 8000 });
    await context.evaluate(async function () {
      if (document.querySelector('.cookies-overlay-dialog__accept-all-btn')) {
        document.querySelector('.cookies-overlay-dialog__accept-all-btn').click();
      }
    });
  } catch (error) {
    console.log('No cookies pop-up.');
  }

  try {
    await context.waitForSelector('iframe[title="Flix-media-video-0"]');
  } catch(e) {
    console.log('Video in product information is not present');
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'ep',
    transform: transform,
    domain: 'ep.at',
    zipcode: '',
  },
  implementation,
};
