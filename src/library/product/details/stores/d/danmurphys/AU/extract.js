const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const video = document.querySelector('.icon-fa-video-camera.icon-video');
    if (video) document.getElementById('slick-slide02').click();
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'danmurphys',
    transform,
    domain: 'danmurphys.com.au',
    zipcode: '',
  },
  implementation,
};
