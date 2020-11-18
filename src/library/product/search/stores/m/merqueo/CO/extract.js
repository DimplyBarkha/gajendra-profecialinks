async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  // await context.evaluate(async () => {
  //   // scroll
  //   function stall(ms) {
  //     return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         resolve();
  //       }, ms);
  //     });
  //   }

  //   let scrollTop = 0;
  //   do {
  //     await stall(1000);
  //     scrollTop += 380;
  //     window.scroll(0, scrollTop);
  //   } while (scrollTop <= window.innerHeight);
  // });

  // await context.evaluate(() => {
  //   const priceSelector = document.querySelectorAll('div[class="mq-product-prices"]');
  //   let price;
  //   const productUrlSelector = document.querySelectorAll('div[class="mq-product-img"]>div>a');
  //   let productUrl;
  //   const allProducts = productUrlSelector.length;

  //   for (let i = 0; i < allProducts; i++) {
  //     if (priceSelector[i]) {
  //       price = priceSelector[i].textContent.replace('.', ',');
  //     }

  //     if (productUrlSelector[i].href !== undefined && productUrlSelector[i].href !== null) {
  //       productUrl = productUrlSelector[i].href;
  //     }

  //     document.querySelectorAll('.mq-product-prices')[i].setAttribute('price', price);
  //     document.querySelectorAll('.mq-product-img>div>a')[i].setAttribute('producturl', productUrl);
  //     document.querySelectorAll('.mq-grid-item')[i].setAttribute('rank', `${i + 1}`);
  //   }
  // });
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // const dataLength = await context.evaluate(async () => {
  //   const responseJson = await fetch('https://merqueo.com/api/3.1/stores/63/search?q=leche&page=1&per_page=50&');
  //   const dataArray = await responseJson.json();
  //   return dataArray;
  // });

  // dataLength.data.forEach(element => {
  //   context.addToDom('productInfo');
  // });

  await context.evaluate(async () => {
    function addProp (selector, iterator, name, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(name, value);
    }
    const responseJson = await fetch('https://merqueo.com/api/3.1/stores/63/search?q=leche&page=1&per_page=50&');
    const data = await responseJson.json();

    for (let i = 0; i < data.data.length; i++) {
      const productInfo = document.createElement('div');
      productInfo.className = 'productinfo';
      document.body.appendChild(productInfo);
      const name = data.data[i].attributes.name;
      const productId = data.data[i].id;
      const image = data.data[i].attributes.image_large_url;
      const productUrl = '';
      let price = data.data[0].attributes.pum[0];
      price = price.replace('.', ',');
      price = price.match('$(.*)');
      price = '$' + price;

      addProp('div.productinfo', i, 'name', name);
      addProp('div.productinfo', i, 'image', image);
      addProp('div.productinfo', i, 'productid', productId);
      addProp('div.productinfo', i, 'producturl', productUrl);
      addProp('div.productinfo', i, 'rank', `${i + 1}`);
      addProp('div.productinfo', i, 'price', price);
    }
  });

  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    transform: null,
    domain: 'merqueo.com',
    zipcode: '',
  },
  implementation,
};
