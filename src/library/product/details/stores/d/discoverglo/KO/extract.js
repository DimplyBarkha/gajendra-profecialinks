const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
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
    const { transform } = parameters;
    const { productDetails } = dependencies;

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
      if (document.querySelector('div#popup_image_61')) {
        document.querySelector('div#popup_image_61 button').click();
      }
      if (document.querySelector('input#juminsag')) {
        document.getElementById('juminsag').value = '19840101';
        if (document.querySelector('button#entrance')) {
          document.querySelector('button#entrance').click();
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return await context.extract(productDetails, { transform });
  },
};
