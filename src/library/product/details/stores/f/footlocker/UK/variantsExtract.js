const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'footlocker',
    transform: cleanUp,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },

  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(() => {
      const variantid = [];
      const url = window.location.href;
      const trimmedurl = url.split('=')[0];
      let data = '';
      const getSizeVariants = document.querySelectorAll('#fitanalytics_sizecontainer > section:nth-child(3) > div >button');
      for (let i = 0; i < getSizeVariants.length; i++) {
        data = getSizeVariants[i].getAttribute('data-product-size-select-item');
        if (data) {
          variantid.push(data);
        }
      }
      variantid.forEach((id) => {
        const div = document.createElement('div');
        div.className = 'variantid';
        div.setAttribute('id', id.toString());
        div.setAttribute('url', trimmedurl.toString() + id.toString());
        document.body.appendChild(div);
      });
    });
    const { transform } = parameters;
    const { variants } = dependencies;
    return await context.extract(variants, { transform });
  },

};
