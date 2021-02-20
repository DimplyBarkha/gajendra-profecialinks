const { transform } = require('./shared');
// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  await context.evaluate(async () => {
    const url = window.location.href;
    const perPage = document.querySelectorAll('a.cm-ajax.ty-sort-dropdown__content-item-a')
      // @ts-ignore
      ? [...document.querySelectorAll('a.cm-ajax.ty-sort-dropdown__content-item-a')].filter(e => e.innerText.includes('96')) : [];
    if (perPage.length !== 0 && !url.includes('items_per_page=96')) {
      perPage[0].click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
  });
  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    // searchUrl
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

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
  });
  // await context.evaluate(async function () {
  //   const nextPageElement = document.querySelectorAll('a[class*="ty-pagination__next"]');
  //   if (nextPageElement) {
  //     nextPageElement.forEach(e => e.parentNode.removeChild(e));
  //   }
  // });
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
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
