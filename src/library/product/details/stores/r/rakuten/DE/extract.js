const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'rakuten',
    transform: null,
    domain: 'rakuten.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 2500));
    // await context.click('li#tab-description a');
    await context.evaluate(async function () {
      // cookie consent closer
      if (document.querySelector('div.privacy_prompt.explicit_consent')) {
        document.querySelector('div.button.left').click();
      }

      // collecting breadcrumbs
      const bredcrumSelector = document.querySelectorAll('span[property="name"]');
      let category = '';
      for (let i = 1; i < bredcrumSelector.length; i++) {
        category += bredcrumSelector[i].innerText;
        if (!(i + 1 === bredcrumSelector.length)) {
          category += ' > ';
        };
      }
      document.querySelector('div.vw-breadcrumb').setAttribute('bredcrumb', category);
      // collect listPrice with 
    });
    await context.extract(productDetails);
  },
};
