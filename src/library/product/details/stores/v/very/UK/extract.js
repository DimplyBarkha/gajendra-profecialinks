const { transform } = require('./shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    await new Promise((resolve, reject) => setTimeout(resolve, 750));
    try {
      // @ts-ignore
      if (window.universal_variable && window.universal_variable.product.id) {
        // @ts-ignore
        document.body.setAttribute('produt-id', window.universal_variable.product.id);
      }
    } catch (e) {
      console.log('variant id not found');
    }
  });

  try {
    await context.waitForXPath('//div[@class="amp-anim-container"]/li[position()>1]/img/@src', { timeout: 60000 });
    await context.waitForXPath('//li[1]//div[@class="amp-zoom-overflow"]/img/@data-pin-media | //li[contains(@class, "selected")]//img/@data-pin-media', { timeout: 30000 });
  } catch (e) {
    console.log(`There was an error while running the loading images ${e}`);
  }

  // @ts-ignore
  const variantsArr = await context.evaluate(async () => [...document.querySelectorAll('div[itemprop=offers]')].map(el => {
    const variantObj = {};
    variantObj.sku = el.querySelector('meta[itemprop=sku]').getAttribute('content');
    variantObj.availability = el.querySelector('link[itemprop=availability]').getAttribute('href');
    variantObj.price = el.querySelector('meta[itemprop=price]').getAttribute('content');
    return variantObj;
  }));
  const numOfVariants = variantsArr.length;

  for (let i = 0; i < numOfVariants; i++) {
    await context.evaluate(
      async ({ i, variantsArr }) => {
        // @ts-ignore
        const colors = [...document.querySelectorAll('ul.ppOption--colour li label, ul.customerSelection label[rel]')].map((ele) => ele.getAttribute('rel'));
        const addedVariant = document.createElement('div');
        addedVariant.id = `addedVariant${i}`;
        addedVariant.id = `added_variant${i}`;
        addedVariant.style.display = 'none';
        const sku = variantsArr[i].sku;
        const availability = variantsArr[i].availability ? variantsArr[i].availability.replace('https://schema.org/', '') : null;
        let availability2;
        if (availability == "InStock") {
          availability2 = "In Stock"
        } else if (availability == "OutOfStock") {
          availability2 = "Out Of Stock"
        } else if (availability == "LimitedAvailability") {
          availability2 = "Limited Availability"
        } else if (availability == "SoldOut") {
          availability2 = "Sold Out"
        }
        const price = variantsArr[i].price;
        if (document.querySelectorAll('li.ppOption__item label').length > 0) {
          // @ts-ignore
          const variantLi = [...document.querySelectorAll('li.ppOption__item label')].map(el => {
            const variantLis = {};
            variantLis.size = el.getAttribute('rel');
            return variantLis;
          });
          const size = variantLi[i].size;
          addedVariant.setAttribute('size', size);
        }
        if (colors.length) addedVariant.setAttribute('color', colors[i]);
        addedVariant.setAttribute('sku', sku);
        addedVariant.setAttribute('availability', availability2);
        addedVariant.setAttribute('price', price);
        document.body.appendChild(addedVariant);
      },
      { i, variantsArr },
    );
  }

  // const products = [];
  // const allProducts = await context.evaluate(async (products) => {
  //   const allNodeOffers = document.querySelectorAll('div#microdata div[itemprop="offers"]');
  //   [...allNodeOffers].forEach((prod) => {
  //     const sku = prod.querySelector('meta[itemprop="sku"]') ? prod.querySelector('meta[itemprop="sku"]').getAttribute('content') : '';
  //     const price = prod.querySelector('meta[itemprop="price"]') ? prod.querySelector('meta[itemprop="price"]').getAttribute('content') : '';

  //     products.push({
  //       sku,
  //     });
  //   });
  //   return products;
  // }, products);

  // async function addElements(element) {
  // await context.evaluate(async function (prod) {
  //   if (document.querySelector('#ii_sku')) {
  //     document.querySelector('#ii_sku').remove();
  //   }
  //   if (document.querySelector('#ii_price')) {
  //     document.querySelector('#ii_price').remove();
  //   }
  //   if (document.querySelector('#ii_availability')) {
  //     document.querySelector('#ii_availability').remove();
  //   }
  //   if (document.querySelector('#isImgZoom')) {
  //     document.querySelector('#isImgZoom').remove();
  //   }
  //   if (document.querySelector('#description')) {
  //     document.querySelector('#description').remove();
  //   }
  await context.evaluate(async function () {
    async function addElementToDocument(id, value, key) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.setAttribute('content', key);
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };

    // const availability = prod.availability.replace('https://schema.org/', '');

    // await addElementToDocument('ii_sku', prod.sku, prod.sku);
    // await addElementToDocument('ii_price', prod.price, prod.price);
    // await addElementToDocument('ii_availability', availability === 'OutOfStock' ? 'Out of Stock' : 'In Stock', availability === 'OutOfStock' ? 'No' : 'Yes');

    const isImgZoom = !!document.querySelector('li.amp-slide div.amp-zoom-overflow img');
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
    if (ratingCount.match(regex)) addElementToDocument('ratingcount', ratingCount.match(regex)[1]);

    const color = document.querySelector('h1.productHeading span')
      ? document.querySelector('h1.productHeading span').textContent : '';
    const regexColor = /- (.+)$/;
    // @ts-ignore
    if (color.match(regexColor)) addElementToDocument('color', color.match(regexColor)[1]);

    const description1 = document.querySelector('span[itemprop="description"]') ? document.querySelector('span[itemprop="description"]').innerText : '';
    const description2 = document.querySelectorAll('span[itemprop="description"] ul li') ? document.querySelectorAll('span[itemprop="description"] ul li') : null;
    if (description2) {
      console.log(description2);
      const bulletsArr = [description2];
      const bulletsArrSliced = bulletsArr.slice(1);
      // @ts-ignore
      description2.forEach(e => bulletsArrSliced.push(e.textContent));
      let concatDesc = bulletsArrSliced.join(' || ');
      if (concatDesc) { concatDesc = '|| ' + concatDesc; }
      // addElementToDocument('descriptionBull', concatDesc);
      console.log(concatDesc);
    } else if (description1) {
      // addElementToDocument('description', description1);
      console.log(description1);
    }
  });
  // for (let i = 0; i < allProducts.length; i++) {
  //   const element = allProducts[i];
  //   await addElements(element);
  return await context.extract(productDetails, { transform });
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
