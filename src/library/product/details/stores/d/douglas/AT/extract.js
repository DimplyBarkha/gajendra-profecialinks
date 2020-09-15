
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

      let brand = document.querySelector('a.product-detail-header__brand-line') ? document.querySelector('a.product-detail-header__brand-line').innerText : '';
      let name = document.querySelector('span.product-detail-header__name') ? document.querySelector('span.product-detail-header__name').innerText : '';
      let nameExtended = brand + ' ' + name;
      document.body.setAttribute('nameExtended', nameExtended);

      let getOtherInfo = document.querySelector('#react-tabs-2');
      if (getOtherInfo) {
        getOtherInfo.click();
        let otherinfo = document.querySelector('div.product-detail-content__html').innerText;
        document.body.setAttribute('otherinfo', otherinfo);
      }

      let getIngredients = document.querySelector('#react-tabs-3');
      if (getIngredients) {
        getIngredients.click();
        let ingredients = document.querySelector('div.product-detail-content__html').innerText;
        document.body.setAttribute('ingredients', ingredients);
      }

      let expandDescription = document.querySelector('span.product-detail-content__toggle');
      if (expandDescription && expandDescription.innerText.includes('Mehr'))
        expandDescription.click();

      let url = window.location.href;
      console.log('url');
      if (url.includes('variant')) {
        let variantid = url.split('variant=')[1];
        document.body.setAttribute('variantid', variantid);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
