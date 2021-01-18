const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'bruneau',
    transform,
    domain: 'bruneau.fr',
    zipcode: '',
  },
  implementation: async (
    inputs,
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    const product = await context.evaluate(() =>
      document.querySelector('#product-page'),
    );
    if (!product) {
      await context.waitForSelector('.isg-item-slider');
      await context.setInputValue('.isg-autocomplete-input', inputs.id);
      await context.clickAndWaitForNavigation('#isg-header-search-submit');
    }
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
        // @ts-ignore
        if (rating.title.length === 1) {
          // @ts-ignore
          rating.title = rating.setAttribute('title', (rating.title += ',0'));
        }
      }
      if (ratingAlt) {
        // @ts-ignore
        if (ratingAlt.title.length === 1) {
          // @ts-ignore
          ratingAlt.title = ratingAlt.setAttribute(
            'title',
            // @ts-ignore
            (ratingAlt.title += ',0'),
          );
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
