
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
      const getVariantsSize = document.querySelectorAll('div.product-detail__size-variants input');
      const getVariantsColor = document.querySelectorAll('li.product-detail__variant-selector-item');
      getVariantsColor.forEach(item => {
        const getId = item.getAttribute('value');
        const id = document.querySelector('div.bazaarvoice').getAttribute('data-bv-product-id');
        const url = `https://www.douglas.at/de/p/${id}?variant=${getId}`;
        console.log(url);
        item.setAttribute('url', url);
      });
      getVariantsSize.forEach(item => {
        const getId = item.getAttribute('id');
        const id = document.querySelector('div.bazaarvoice').getAttribute('data-bv-product-id');
        const url = `https://www.douglas.at/de/p/${id}?variant=${getId}`;
        console.log(url);
        item.setAttribute('url', url);
      });
    });
    await context.extract(variants);
  },
};
