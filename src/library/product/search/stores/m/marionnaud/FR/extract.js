async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
  
    const price = document.querySelector('span.lineinner');
    if (price && price.textContent) {
      let priceText = price.textContent;
      if (priceText.includes('€')) {
        priceText = priceText.replace('€', '.');
        priceText=priceText+'€'
      }
      addHiddenDiv('priceText', priceText);
    }
    const aggregateRating = document.querySelector('div.star-rating__filled-stars').getAttribute('style')
    var ratingValue=aggregateRating.split(':')
    var aggregateratingValue=ratingValue[1]
    var replaceValue=aggregateratingValue.replace('%','')
      // @ts-ignore
      const finalAggregatingValue=(replaceValue*5)/100
      addHiddenDiv('aggregateRating', finalAggregatingValue);
});


return await context.extract(productDetails, { transform });
}
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    transform: cleanUp,
    domain: 'marionnaud.fr',
    zipcode: '',
  },
  inputs: [ 
  ],
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
