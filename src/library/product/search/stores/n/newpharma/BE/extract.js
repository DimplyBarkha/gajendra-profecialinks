const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function checkPopups () {
    await context.evaluate(() => {
      const popUp = document.querySelector('div[id="wps_popup"]');
      if (popUp !== null) {
        popUp.remove();
      }
      const popUpSecond = document.querySelector('div[id="js-cookie-policy-popup"]');
      if (popUpSecond !== null) {
        popUpSecond.remove();
      }
    });
  }
  // wating for popUp
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await checkPopups();
  // wating for more popUps
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await checkPopups();

  await new Promise((resolve) => setTimeout(resolve, 5000));
  async function autoScroll (page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
  await autoScroll(context);
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await context.evaluate(async () => {
    const addElementToDocument = (key, value) => {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    addElementToDocument('added-search-url', window.location.href);
    const allProducts = document.querySelectorAll('div.product.js-product-row');
    allProducts.forEach((product, index) => {
      let ratingAppended = false;
      let reviewsAppended = false;
      try {
        const productUrl = `https:${product.querySelector('a.details__title').getAttribute('href')}`;
        product.setAttribute('product-url', productUrl);
        const productJson = JSON.parse(product.getAttribute('data-google-360')).ecommerce.click.products[0];
        if (productJson.rating.match(/\d(.\d)?/)) {
          product.setAttribute('product-rating', productJson.rating.match(/\d(.\d)?/)[0].replace('.', ','));
          ratingAppended = true;
        }
        const reviewCount = product.querySelector('a[id*=listing_reviews') ? product.querySelector('a[id*=listing_reviews').textContent.match(/\d+/)[0] : '0';
        product.setAttribute('product-reviews', reviewCount);
        reviewsAppended = true;
      } catch (e) {
        console.log('Error extracting product json', e.message);
      }
      let reveiewsSel = '*[id*="listing_reviews"]';
      let reviewRegex = /(\d+)\s?avis/g;
      let ratingSel = '';
      let ratingRegex = /(.+),"rating":(.+),"type"(.+)/g;
      if(!ratingAppended) {
        let ratingText = product.getAttribute('data-google-360');
        let ratingCount = '';
        if(ratingText) {
          ratingCount = ratingText.replace(ratingRegex, '$2');
        }

        if(ratingCount) {
          console.log('ratingCount', ratingCount);
          product.setAttribute('product-rating', ratingCount);
          ratingAppended = true;
        }
        console.log('ratingAppended', ratingAppended)
      }

      if(!reviewsAppended) {
        let reviewElm = product ? product.querySelector(reveiewsSel) : null;
        let reviewCount = '';
        let reviewCountText = '';
        if(reviewElm) {
          reviewCountText = reviewElm.textContent;
        }
        if(reviewCountText) {
          reviewCountText = reviewCountText.trim();
        }

        reviewCount = reviewCountText.replace(reviewRegex, '$1');
        if(reviewCount) {
          product.setAttribute('product-reviews', reviewCount);
          reviewsAppended = true;
          console.log('reviewCount', reviewCount);
        }
        console.log('reviewsAppended', reviewsAppended);
      }

    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'newpharma',
    transform: transform,
    domain: 'newpharma.be',
    zipcode: "''",
  },
  implementation,
};
