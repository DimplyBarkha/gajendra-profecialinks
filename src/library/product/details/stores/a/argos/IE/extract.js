const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  function addBrand () {
    try {
      const brand = Array.from(
        document
          .querySelector('#BVFrame')
          .contentWindow.document.querySelectorAll('script'),
      )
        .find((elm) => elm.innerText.includes('"brand"'))
        .innerText.match(/"brand":"([^"]+)/)[1];
      document.body.setAttribute('brand', brand);
    } catch (err) {
      console.log('Error retrieving brand value.');
    }
  }
  await context.evaluate(addBrand);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'argos',
    transform,
    domain: 'argos.ie',
    zipcode: '',
  },
  implementation,
};
