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
    try {
      await context.waitForSelector('.slick-list.draggable .slick-active img', { timeout: 30000 });
      await context.evaluate(async () => {
        function getDivWithId (id) {
          const div = document.createElement('div');
          div.setAttribute('id', id);
          return div;
        }
        const url = window.location.href;
        const sku = url.split('=')[1];
        document.body.setAttribute('variant-id', sku.toString());
        const variantid = [];
        const getSizeVariants = document.querySelectorAll('#fitanalytics_sizecontainer > section:nth-child(3) > div >button');
        for (let i = 0; i < getSizeVariants.length; i++) {
          if (getSizeVariants[i].getAttribute('data-product-size-select-item')) {
            variantid.push(getSizeVariants[i].getAttribute('data-product-size-select-item'));
          }
        }
        for (let i = 0; i < variantid.length; i++) {
          const div = getDivWithId('variantId');
          div.setAttribute('data', variantid[i]);
          document.body.append(div);
        }
        const query = "button[data-product-size-select-item='" + sku + "']";
        const selectedBtn = document.querySelectorAll(query);
        if (selectedBtn[2]) { selectedBtn[2].click(); }
        if (!selectedBtn && !document.querySelector('section:nth-child(3) > div >button[data-form-field-target="SKU"]')) {
          const div = getDivWithId('stock');
          div.innerText = 'Out of Stock';
          document.body.append(div);
        }
      });
    } catch (err) {
      console.log('Image did not load');
    }
    const { cleanUp } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { cleanUp });
  },

};
