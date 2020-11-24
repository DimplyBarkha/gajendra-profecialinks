const { transform } = require('../../../../shared');
// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // pagination on scroll
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    const numberOfProducts = parseInt(document.querySelector('span.ty-mainbox-title__right').textContent.match(/\d+/gm)[0]);
    let productCount = 0;
    for (let i = 0; i < 32; i++) {
      productCount += document.querySelectorAll('div[class="ty-column3"] > div[class*="list__item"]').length - productCount;
      window.scroll(0, document.body.scrollHeight);
      await stall(1000);
      if (productCount >= numberOfProducts) {
        break;
      }
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  await context.evaluate(async () => {
    // price

    const price = document.querySelectorAll('span[class*="ty-price"][id*="line"]')
      ? document.querySelectorAll('span[class*="ty-price"][id*="line"]') : [];
    price.forEach(e => e.setAttribute('price', e.innerText.replace('.', ',')));

    // rating

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

    // rank

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
