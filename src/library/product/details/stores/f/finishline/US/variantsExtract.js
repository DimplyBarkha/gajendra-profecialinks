
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'finishline',
    transform: null,
    domain: 'finishline.com',
    zipcode: "''",
  },
  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    await context.evaluate(async function () {
      //  if no variants available , pull sku and product page url
      var i;
      const url = 'https://www.finishline.com'+window.location.pathname;
      const variantAvailable = document.querySelectorAll('div#alternateColors div.colorway a');
      if (variantAvailable) {
        for(i=0; i<variantAvailable.length; i++){
          console.log('Variant Info =>',variantAvailable[i].getAttribute('data-productid'));
          const div = document.createElement('div');
          div.className = 'selectable-card';
          const getInput = document.createElement('input');
          getInput.id = variantAvailable[i].getAttribute('data-productid');
          div.appendChild(getInput);
          document.body.appendChild(div);
          const splittedVal = variantAvailable[i].getAttribute('data-productid').split('_');
          console.log('Variant Url ==>',url+'?styleId='+splittedVal[0]+'&colorId='+splittedVal[1]);
          getInput.setAttribute('value', url+'?styleId='+splittedVal[0]+'&colorId='+splittedVal[1]);

        }
      }
    });
    await context.extract(variants);
  },
};
