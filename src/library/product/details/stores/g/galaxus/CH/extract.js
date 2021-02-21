const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    transform,
    domain: 'galaxus.ch',
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
      await context.click('#description button');
      await context.click('#specifications button');
      await context.click('#returnsAndWarranty');
    } catch (e) {
      console.log(e);
    }
    await context.evaluate(async function(){
      let specificationButton = document.querySelector('button[data-test="showMoreButton-specifications"]');
      if(specificationButton){
        specificationButton.click();
      }
      let descriptionButton = document.querySelector('button[data-test="showMoreButton-description"]');
      if(descriptionButton){
        descriptionButton.click();
      }
    });

    const variantSelectorObject = await context.evaluate(() => {
      const variantSelector = document.querySelectorAll('a.styled__StyledButton-sc-1b7q9no-1.hPXcsG');
      return { isVariant: !!variantSelector.length, count: variantSelector.length };
    });
    if (variantSelectorObject.isVariant) {
      for (let i = 1; i <= variantSelectorObject.count; i++) {
        const variant = `div[class="Z1vd"]:nth-child(${i}) a`;
        await context.click(variant);
        await context.extract(productDetails, { transform }, { type: 'APPEND' });
      }
    } else return await context.extract(productDetails, { transform });
  },
};
