const { transform } = require('./../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'KO',
    store: 'discoverglo',
    transform,
    domain: 'discoverglo.co.kr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productReviews } = dependencies;

    try {
      await context.waitForSelector('div#Cookie', { timeout: 5000 });
    } catch (e) {
      console.log('cookies not loaded');
    }

    await context.evaluate(async function () {
      if (document.querySelector('div#Cookie')) {
        document.querySelector('button#ok_col').click();
      }
      if (document.querySelector('div.btns button.btnf-yes')) {
        document.querySelector('div.btns button.btnf-yes').click();
      }
      if (document.querySelector('input#juminsag')) {
        document.getElementById('juminsag').value = '19840101';
        if (document.querySelector('button#entrance')) {
          document.querySelector('button#entrance').click();
        }
      }
      if (document.querySelector('li#showTab2')) {
        document.querySelector('li#showTab2 a').click();
      }
    });

    return await context.extract(productReviews, { transform });
  },
};
