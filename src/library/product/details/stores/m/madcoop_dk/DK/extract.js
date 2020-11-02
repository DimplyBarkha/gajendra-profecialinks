
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'madcoop_dk',
    transform: null,
    domain: 'madcoop.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    try {
      await context.evaluate(async function () {
        const a = document.querySelector('.tabs-component-tab>a[aria-controls="#ingredienser"]');
        const b = document.querySelector('.tabs-component-tab>a[aria-controls="#opbevaring"]');
        const c = document.querySelector('.tabs-component-tab>a[aria-controls="#tilberedning"]');
        if (a) {
          await context.click('.tabs-component-tab>a[aria-controls="#ingredienser"]');
        } else if (b) {
          await context.click('.tabs-component-tab>a[aria-controls="#opbevaring"]');
        } else if (c) {
          await context.click('.tabs-component-tab>a[aria-controls="#tilberedning"]');
        } else {
          console.log('No such section present in the website.');
        }
      });
    } catch (e) {
      console.log(e.message);
    } finally {
      await context.extract(productDetails);
    }
  },
};
