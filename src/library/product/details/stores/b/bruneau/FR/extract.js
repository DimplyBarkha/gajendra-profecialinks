
const { transform } = require('../shared');


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'bruneau',
    transform: transform,
    domain: 'bruneau.fr',
    zipcode: '',
  },
  implementation: async (
    { url },
    { country, domain },
    context,
    dependencies,
  ) => {
    await context.evaluate(() => {
      const zoom = document.querySelector('a.cursor-zoom-in');
      const pdf = document.querySelector('button.document');
      const image360 = document.querySelector('button.view-3D-button');

      if (zoom) {
        zoom.setAttribute('zoom', 'yes');
      }
      if (pdf) {
        pdf.setAttribute('pdf', 'yes');
      }
      if (image360) {
        image360.setAttribute('image360', 'yes');
      }
    });
    await context.extract(dependencies.productDetails);
  },
};
