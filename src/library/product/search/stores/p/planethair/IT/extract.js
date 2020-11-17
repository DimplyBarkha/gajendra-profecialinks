const { transform } = require('../../../../shared');
// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise(resolve => setTimeout(resolve, 5000));

  await context.evaluate(() => {
    const products = document.querySelectorAll('div[class="ty-column3"] > div[class*="list__item"]')
      ? document.querySelectorAll('div[class="ty-column3"] > div[class*="list__item"]') : [];
    products.forEach((e, i) => {
      const searchUrl = document.querySelector('input[name="redirect_url"]')
        ? document.querySelector('input[name="redirect_url"]') : '';
      const prefix = 'https://www.planethair.it/';
      // @ts-ignore
      e.setAttribute('searchurl', prefix.concat(searchUrl.getAttribute('value')));
    });

    // @ts-ignore

    const price = document.querySelectorAll('span[class*="ty-price"][id*="line"]')
      ? document.querySelectorAll('span[class*="ty-price"][id*="line"]') : [];
    price.forEach(e => e.setAttribute('price', e.innerText.replace('.', ',')));

    const ratings = document.querySelectorAll('span.ty-nowrap.ty-stars a')
      ? document.querySelectorAll('span.ty-nowrap.ty-stars a') : [];
    // @ts-ignore
    const ratingsWithChild = [...ratings].map(e => [...e.childNodes]);
    const fullStars = ratingsWithChild.map(e => e.filter(k => !k.classList[1].includes('empty') && !k.classList[1].includes('half')).length);
    const halfStars = ratingsWithChild.map(e => e.filter(k => k.classList[1].includes('half')).length * 0.5);
    ratings.forEach((e, i) => e.setAttribute('ratings', (fullStars[i] + halfStars[i]).toString().replace('.', ',')));
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
