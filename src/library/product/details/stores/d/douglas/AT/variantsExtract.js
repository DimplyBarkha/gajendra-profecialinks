
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform: null,
    domain: 'douglas.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { variants }) => {
    await context.evaluate(async function () {
      let getVariantsSize = document.querySelectorAll('div.product-detail__size-variants input')
      let getVariantsColor = document.querySelectorAll('li.product-detail__variant-selector-item')
      getVariantsColor.forEach(item=>{
          let getId = item.getAttribute('value');
          let id = document.querySelector('div.bazaarvoice').getAttribute('data-bv-product-id');
          let url = `https://www.douglas.at/de/p/${id}?variant=${getId}`;
          console.log(url);
          item.setAttribute('url',url);
      });
      getVariantsSize.forEach(item=>{
        let getId = item.getAttribute('id');
        let id = document.querySelector('div.bazaarvoice').getAttribute('data-bv-product-id');
        let url = `https://www.douglas.at/de/p/${id}?variant=${getId}`;
        console.log(url);
        item.setAttribute('url',url);
    });

    });
    await context.extract(variants);
    },
};
