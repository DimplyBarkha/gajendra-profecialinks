const {transform}= require('./transform')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    transform : transform,
    domain: 'walmart.com.mx',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
        const popUps = document.querySelector('div.coaching-tip_innerContainer__1FCV- > button');
        if (popUps) popUps.click();
    });

    await context.evaluate(async function () {

      const forFeatures = document.querySelectorAll('div.product-description_titles__3Z6Lo div.product-description_tabs__2-frl');
      for (let i = 0; i < forFeatures.length; i++) {
          if(forFeatures[i].innerText === 'Características'){
               forFeatures[i].click();
          }
      }
  });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};

