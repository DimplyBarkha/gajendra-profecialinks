const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    transform,
    domain: 'promofarma.com',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      try {
        // @ts-ignore
        document.querySelector('button[id="onetrust-accept-btn-handler"]').click()
        await new Promise(r => setTimeout(r, 10000));

      } catch (error) {

      }
      
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="rating-box"] div[class="rating-stars"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addHiddenDiv1(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }       
      const aggregateRating = document.querySelectorAll('div[class="rating-box"] div[class="rating-stars"]')
      for (let k = 0; k < aggregateRating.length; k++) {
        // @ts-ignore
        let singleRating = aggregateRating[k].style.width;
        singleRating = singleRating.slice(0, singleRating.length - 1)
        singleRating = (5 * singleRating) / 100;
        singleRating = singleRating.toFixed(1);
        addHiddenDiv('aggregateRating', singleRating, k);

      }
      const url = window.location.href;
      addHiddenDiv1('added-searchurl', url);

    });
    return await context.extract(productDetails, { transform });
  },
}