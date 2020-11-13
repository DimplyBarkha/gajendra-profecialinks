const { transform } = require('../../../../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 5000));
  await context.evaluate(() => {
    const ratings = document.querySelectorAll('span.ty-nowrap.ty-stars a')
      ? document.querySelectorAll('span.ty-nowrap.ty-stars a') : [];
    // @ts-ignore
    const ratingsWithChild = [...ratings].map(e => [...e.childNodes]);
    const result = ratingsWithChild.map(e => e.filter(k => !k.classList[1].includes('empty')).length);
    ratings.forEach((e, i) => e.setAttribute('ratings', result[i]));

    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    const allProducts = document.querySelectorAll('div[class="ty-column3"] > div[class*="list__item"]');
    for (let i = 0; i < allProducts.length; i++) {
      addProp('div[class="ty-column3"] > div[class*="list__item"]', i, 'rankorganic', `${i + 1}`);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'planethair',
    transform: transform,
    domain: 'planethair.it',
    zipcode: '',
  },
  implementation,
};
