const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    transform: cleanUp,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { cleanUp } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      const getvariants = document.querySelectorAll('div.owl-stage a');
      const variantid = [];
      for (let i = 0; i < getvariants.length; i++) {
        variantid.push(getvariants[i].getAttribute('data-product-click-link'));
      }
      const getSizeVariants = document.querySelectorAll('#fitanalytics_sizecontainer > section:nth-child(3) > div >button');
      for (let i = 0; i < getSizeVariants.length; i++) {
        if (getSizeVariants[i].getAttribute('data-product-size-select-item')) {
          variantid.push(getSizeVariants[i].getAttribute('data-product-size-select-item'));
        }
      }
      for (let i = 0; i < variantid.length; i++) {
        const div = document.createElement('div');
        div.setAttribute('id', 'variantId');
        div.setAttribute('data', variantid[i]);
        document.body.append(div);
      }
    });
    try {
      await context.waitForSelector('.slick-list.draggable .slick-active img', { timeout: 30000 });
    } catch (err) {
      console.log('Image did not load');
    }
    // await context.waitForSelector('.fl-picture--img');
    return await context.extract(productDetails, { cleanUp });
  },

};
