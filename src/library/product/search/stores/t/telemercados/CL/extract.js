const {transform}=require('../CL/format')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'telemercados',
    transform,
    domain: 'telemercados.cl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let count = document.querySelectorAll('div[id*="ResultItems_"] ul li div.product-info').length;

        while (count < 150) {
          const oldCount = count;
          //document.querySelector('button.ltr-1upsixo') && document.querySelector('button.ltr-1upsixo').click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          count = document.querySelectorAll('div[id*="ResultItems_"] ul li div.product-info').length;
          const scrollElement = document.querySelector('div[id*="ResultItems_"] ul li');

          if (scrollElement) {
            scrollElement.scrollIntoView({ behaviour: 'smooth', block: 'end' });
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          if (oldCount === count) {
            break;
          }
        }
      });
    };
    await applyScroll(context);

    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
