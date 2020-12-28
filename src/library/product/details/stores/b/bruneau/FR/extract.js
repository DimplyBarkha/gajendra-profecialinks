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
      if (zoom) {
        zoom.setAttribute('zoom', 'yes');
      }
      const pdf = document.querySelector('button.document');

      if (pdf) {
        pdf.setAttribute('pdf', 'yes');
      }
      const image360 = document.querySelector('button.view-3D-button');
      if (image360) {
        image360.setAttribute('image360', 'yes');
      }
    });

    await context.evaluate(() => {
      const rating = document.querySelector('.rating > span');
      const ratingAlt = document.querySelector('.rating-container > span');

      if (rating) {
        if (rating.title.length === 1) {
          rating.title =
          rating.setAttribute('title', rating.title += ',0');
        }
      }
      if (ratingAlt) {
        if (ratingAlt.title.length === 1) {
          ratingAlt.title =
          ratingAlt.setAttribute('title', ratingAlt.title += ',0');
        }
      }
    });
    await context.extract(dependencies.productDetails);
  },
};
