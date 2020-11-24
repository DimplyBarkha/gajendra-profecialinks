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

  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    await context.evaluate(() => {
      const getvariants = document.querySelectorAll('div.owl-stage a');
      const variantid = [];
      const url = window.location.href;
      const trimmedurl = url.split('=')[0];
      let data = '';
      for (let i = 0; i < getvariants.length; i++) {
        data = getvariants[i].getAttribute('data-product-click-link');
        console.log(data);
        variantid.push(data);
      }
      const getSizeVariants = document.querySelectorAll('#fitanalytics_sizecontainer > section:nth-child(3) > div >button');
      for (let i = 0; i < getSizeVariants.length; i++) {
        data = getSizeVariants[i].getAttribute('data-product-size-select-item');
        const div = document.createElement('div');
        div.className = 'variantid';
        const getInput = document.createElement('li');
        getInput.id = 'variant';
        div.appendChild(getInput);
        document.body.appendChild(div);
        console.log(data);
        if (data) {
          variantid.push(data);
          getInput.setAttribute('value', data);
        }
      }
      const varianturl = [];
      const newVariant = Array.from(new Set(variantid));

      for (let i = 0; i < newVariant.length; i++) {
        const div = document.createElement('div');
        div.className = 'varianturl';
        const getInput = document.createElement('li');
        getInput.id = 'variant';
        div.appendChild(getInput);
        document.body.appendChild(div);
        varianturl.push(trimmedurl + '=' + newVariant[i]);
        getInput.setAttribute('urlvalue', varianturl[i]);
        getInput.setAttribute('variantid', newVariant[i]);
      }
    });
    await context.extract(variants);
  },

};
