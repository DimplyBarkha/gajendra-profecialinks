
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform: null,
    domain: 'douglas.at',
    zipcode: '',
  },

  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const brand = document.querySelector("span[class*='brand-logo-text']") ? document.querySelector("span[class*='brand-logo-text']").innerText : '';
      const name = document.querySelector('span.product-detail-header__name') ? document.querySelector('span.product-detail-header__name').innerText : '';
      const nameExtended = brand + ' ' + name;
      document.body.setAttribute('nameExtended', nameExtended);
      await new Promise(resolve => setTimeout(resolve, 4000));
      let specification = document.querySelector('div.product-detail-content__classifications') ? document.querySelector('div.product-detail-content__classifications').innerText : '';
      specification = specification.replace('\n', ' ');
      document.head.setAttribute('specification', specification);
      const description = document.querySelector('div.product-detail-content__description') ? document.querySelector('div.product-detail-content__description').innerText : '';
      document.head.setAttribute('description', description);
      const data = document.querySelector('script[type="application/ld+json"]');
      const getSku = data.innerText.trim();
      const sku = (getSku.match(/(.*)sku": "(.*?)"(.*)/g)[0]).match(/(\d+)/g)[0];
      document.head.setAttribute('sku', sku);
      const getOtherInfo = document.querySelector('#react-tabs-2');
      if (getOtherInfo) {
        getOtherInfo.click();
        await new Promise(resolve => setTimeout(resolve, 4000));
        const otherinfo = document.querySelector('div.product-detail-content__html').innerText;
        document.body.setAttribute('otherinfo', otherinfo);
      }

      const getIngredients = document.querySelector('#react-tabs-3');
      if (getIngredients) {
        getIngredients.click();
        const ingredients = document.querySelector('div.product-detail-content__html').innerText;
        document.body.setAttribute('ingredients', ingredients);
      }

      const expandDescription = document.querySelector('span.product-detail-content__toggle');
      if (expandDescription && expandDescription.innerText.includes('Mehr')) { expandDescription.click(); }

      const url = window.location.href;
      console.log('url');
      if (url.includes('variant')) {
        const variantid = url.split('variant=')[1];
        document.body.setAttribute('variantid', variantid);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
