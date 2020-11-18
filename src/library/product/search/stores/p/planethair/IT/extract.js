const { transform } = require('../../../../shared');
// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const nextLink = await context.evaluate(() => {
    const nextSelector = document.querySelector('div#pagination_contents > div.ty-pagination a[class*="next"]')
      ? document.querySelector('div#pagination_contents > div.ty-pagination a[class*="next"]') : null;
    return nextSelector;
  });

  // manual pagination

  if (nextLink || nextLink === null) {
    do {
      // closing all modals
      const isTopModal = await context.evaluate(async () => {
        return document.querySelector('div#adroll_allow');
      });
      const isCookies = await context.evaluate(async () => {
        return document.querySelector('div#adroll_allow_all');
      });
      const isModalPresent = await context.evaluate(async () => {
        return document.querySelector('div[class*="mc-closeModal"]');
      });
      const isMessagePresent = await context.evaluate(async () => {
        return document.querySelector('jdiv[class*="closeButton_2b1"]');
      });

      if (isTopModal !== null && isTopModal !== undefined) {
        await context.evaluate(() => {
          // @ts-ignore
          document.querySelector('div#adroll_allow').click();
        });
      }
      if (isCookies !== null && isCookies !== undefined) {
        await context.evaluate(() => {
          // @ts-ignore
          document.querySelector('div#adroll_allow_all').click();
        });
      }
      if (isModalPresent !== null && isModalPresent !== undefined) {
        await context.evaluate(() => {
          // @ts-ignore
          document.querySelector('div[class*="mc-closeModal"]').click();
        });
      }
      if (isMessagePresent !== null && isMessagePresent !== undefined) {
        await context.evaluate(() => {
          // @ts-ignore
          document.querySelector('jdiv[class*="closeButton_2b1"]').click();
        });
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));

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

      // if nextLink is null or page limit is reached, extract page and break loop, else click in it
      const nextLinkPage = await context.evaluate(() => {
        const nextPage = document.querySelector('div#pagination_contents > div.ty-pagination a[class*="next"]')
          ? document.querySelector('div#pagination_contents > div.ty-pagination a[class*="next"]').getAttribute('data-ca-page') : '';
        return nextPage;
      });

      if ((await context.evaluate(() => {
        return document.querySelector('div#pagination_contents > div.ty-pagination a[class*="next"]');
      }) === null || (nextLinkPage === '17' && nextLinkPage !== ''))) {
        return context.extract(productDetails, { transform });
      } else {
        await context.extract(productDetails, { transform });

        await new Promise((resolve, reject) => setTimeout(resolve, 5000));

        await context.evaluate(() => {
          // @ts-ignore
          document.querySelector('div#pagination_contents > div.ty-pagination a[class*="next"]').click();
        });
      }
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    // eslint-disable-next-line no-unmodified-loop-condition
    } while (nextLink !== null);
  } else {
    return await context.extract(productDetails, { transform });
  }
};

// return await context.extract(productDetails, { transform });

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
