
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
    const values = document.querySelectorAll('div.VisualOptionCard > div > div > label > input');
    values.forEach(item => {
      item.setAttribute('url', window.location.href.replace(/[^htm]+$/g, `l?piid=${item.getAttribute('value')}`));
    });
  }, createUrl);
  return await context.extract(variants);
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform: null,
    domain: 'wayfair.com',
    zipcode: '',
  },
  implementation,
};
