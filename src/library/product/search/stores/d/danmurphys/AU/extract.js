const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    const els = document.querySelectorAll('.star-rating-container');
    els.forEach(el => {
      el.setAttribute('starCounter', el.innerHTML.match(/checked/gmi) ? el.innerHTML.match(/checked/gmi).length.toString() : '0');
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'danmurphys',
    transform,
    domain: 'danmurphys.com.au',
    zipcode: '',
  },
  implementation,
};
