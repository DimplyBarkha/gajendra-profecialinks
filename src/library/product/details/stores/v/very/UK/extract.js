const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 750));
  });
  const products = [];
  const allProducts = await context.evaluate(async (products) => {
    const allNodeOffers = document.querySelectorAll('div#microdata div[itemprop="offers"]');
    [...allNodeOffers].forEach((prod) => {
      const sku = prod.querySelector('meta[itemprop="sku"]') ? prod.querySelector('meta[itemprop="sku"]').getAttribute('content') : '';
      const price = prod.querySelector('meta[itemprop="price"]') ? prod.querySelector('meta[itemprop="price"]').getAttribute('content') : '';
      const availability = prod.querySelector('link[itemprop="availability"]') ? prod.querySelector('link[itemprop="availability"]').getAttribute('href') : '';

      products.push({
        sku,
        price,
        availability,
      });
    });
    return products;
  }, products);

  async function addElements (element) {
    await context.evaluate(async function (prod) {
      if (document.querySelector('#ii_sku')) {
        document.querySelector('#ii_sku').remove();
      }
      if (document.querySelector('#ii_price')) {
        document.querySelector('#ii_price').remove();
      }
      if (document.querySelector('#ii_availability')) {
        document.querySelector('#ii_availability').remove();
      }
      if (document.querySelector('#isImgZoom')) {
        document.querySelector('#isImgZoom').remove();
      }
      if (document.querySelector('#description')) {
        document.querySelector('#description').remove();
      }

      async function addElementToDocument (id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      const availability = prod.availability.replace('https://schema.org/', '');

      await addElementToDocument('ii_sku', prod.sku, prod.sku);
      await addElementToDocument('ii_price', prod.price, prod.price);
      await addElementToDocument('ii_availability', availability === 'OutOfStock' ? 'Out of Stock' : 'In Stock', availability === 'OutOfStock' ? 'No' : 'Yes');

      // const isAvailable = document.querySelector('div.stockMessaging span.indicator')
      //   ? document.querySelector('div.stockMessaging span.indicator') : null;
      // // @ts-ignore
      // if (isAvailable !== null && isAvailable.innerText === 'Out of stock') {
      //   addElementToDocument('isAvailable', 'Out of Stock', 'No');
      //   // @ts-ignore
      // } else if (document.querySelector('div#addToBasket input#addToBasketButton').value === 'Add to basket') {
      //   addElementToDocument('isAvailable', 'In Stock', 'Yes');
      // } else {
      //   addElementToDocument('isAvailable', '', 'No');
      // }

      const isImgZoom = document.querySelector('li.amp-slide div.amp-zoom-overflow img')
        ? document.querySelector('li.amp-slide div.amp-zoom-overflow img') : null;
      // @ts-ignore
      if (isImgZoom !== null) {
        await addElementToDocument('isImgZoom', 'Yes', 'Yes');
      } else {
        await addElementToDocument('isImgZoom', 'No', 'No');
      }

      const ratingCount = document.querySelector('div.bvReviewsNumber a.productRating')
        ? document.querySelector('div.bvReviewsNumber a.productRating').textContent : '';
      const regex = /(\d+)/;
      // @ts-ignore
      if (ratingCount.match(regex)) document.querySelector('body').setAttribute('ratingcount', ratingCount.match(regex)[1]);

      const color = document.querySelector('h1.productHeading span')
        ? document.querySelector('h1.productHeading span').textContent : '';
      const regexColor = /- (.+)$/;
      // @ts-ignore
      if (color.match(regexColor)) document.querySelector('body').setAttribute('color', color.match(regexColor)[1]);

      const description2 = document.querySelectorAll('span[itemprop="description"] ul li');
      const bulletsArr = [description2];
      const bulletsArrSliced = bulletsArr.slice(1);
      // @ts-ignore
      description2.forEach(e => bulletsArrSliced.push(e.textContent));
      const concatDesc = bulletsArrSliced.join(' || ');
      await addElementToDocument('description', concatDesc);
    }, element);
  }

  for (let i = 0; i < allProducts.length; i++) {
    const element = allProducts[i];
    await addElements(element);
    await context.extract(productDetails, { transform });
  }
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'very',
    transform: transform,
    domain: 'very.co.uk',
    zipcode: '',
  },
  implementation,
};
