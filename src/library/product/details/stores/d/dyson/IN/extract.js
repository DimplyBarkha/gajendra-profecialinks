
const { implementation } = require('../common');
const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    transform,
    domain: 'dyson.in',
    zipcode: '',
  },
  implementation: async function implementation (inputs, parameters, context, dependencies) {
    const { productDetails, Helpers } = dependencies;
    const helpers = new Helpers(context);
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
        if (Array.isArray(value)) {
          const innerHTML =
            value.reduce((acc, val) => {
              return `${acc}<li>${val}</li>`;
            }, '<ul>') + '</ul>';
          catElement.innerHTML = innerHTML;
        } else {
          catElement.textContent = value;
        }
      }
      let specs = '';
      document.querySelectorAll('div.spec-set__item>span').forEach((element) => {
        let spec__label = element.querySelector('.spec__label');
        spec__label = spec__label ? spec__label.innerText.trim() : '';
        let spec__value = element.querySelector('.spec__data');
        spec__value = spec__value ? spec__value.innerText.trim() : '';
        if (spec__label) {
          specs = specs
            ? `${specs} || ${spec__label}${spec__value ? `: ${spec__value}` : ''}`
            : `${spec__label}${spec__value ? `: ${spec__value}` : ''}`;
        }
      });
      addElementToDocument('added_specs', specs);

      const aggRatingXpath = '(//span[contains(@class,"rating__data__value")] | //div[contains(@class,"product--column")]//div[contains(@class,"rating-summary")]//span[@itemprop="ratingValue"] )[1]';
      let aggRatingElm = document.evaluate(aggRatingXpath, document, null, 7, null);
      if (aggRatingElm.snapshotLength > 0) {
        console.log('agg rating is present');
        let aggRatingValue = aggRatingElm.snapshotItem(0).textContent.trim();
        console.log('aggregate rating - ' + aggRatingValue);
        addElementToDocument('aggrating', aggRatingValue);
      } else {
        console.log('agg rating is not retrieved - please check with webpage and update the xpath');
      }

      if (window.dataLayer) {
        const dataObj = window.dataLayer.find(
          (el) => el.event === 'primaryProduct',
        );
        if (dataObj && dataObj.primaryProduct) {
          addElementToDocument('added_sku', dataObj.primaryProduct.productSKU);
        }
      }
    });
    // first check that the page is a valid product page
    return await context.extract(productDetails, {
      transform: parameters.transform,
    });
  },
};
