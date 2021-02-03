const { transform } = require('./transform');

async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  // const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    const url = window.location.href;
    const aggregateRating = document.querySelectorAll('div[class*="rating-box__active"]:not([style*="max-width"])');
    for (let k = 0; k < aggregateRating.length; k++) {
      // @ts-ignore
      let singleRating = aggregateRating[k].style.width;
      singleRating = singleRating.slice(0, singleRating.length - 1);
      singleRating = (5 * singleRating) / 100;
      singleRating = singleRating.toFixed(1);
      console.log(singleRating);
      addHiddenDiv(aggregateRating[k], 'aggregateRating', singleRating);

      addHiddenDiv(aggregateRating[k], 'searchurl', url);
    }
  });
  return await context.extract(productDetails, { transform: parameters.transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UA',
    store: 'comfy',
    transform: transform,
    domain: 'comfy.ua',
    zipcode: '',
  },
  implementation,
};
