async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await context.evaluate(async () => {
    function addProp (selector, iterator, name, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(name, value);
    }
    const responseJson = await fetch('https://merqueo.com/api/3.1/stores/63/search?q=leche&page=1&per_page=50&');
    const data = await responseJson.json();
    let name;
    let productId;
    let image;
    let price;

    for (let i = 0; i < data.data.length; i++) {
      const productInfo = document.createElement('div');
      productInfo.className = 'productinfo';
      document.body.appendChild(productInfo);
      name = data.data[i].attributes.name;
      productId = data.data[i].id;
      image = data.data[i].attributes.image_large_url;
      price = data.data[0].attributes.pum[0];
      price = price.replace('.', ',');
      price = price.match('[$].*');

      addProp('div.productinfo', i, 'name', name);
      addProp('div.productinfo', i, 'image', image);
      addProp('div.productinfo', i, 'productid', productId);
      addProp('div.productinfo', i, 'rank', `${i + 1}`);
      addProp('div.productinfo', i, 'price', price);
    }
  });

  await context.evaluate(async () => {
    const productUrl = [];
    let j = 0;
    // scroll
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    const scrollLimit = 10 * 334;
    while (scrollTop <= scrollLimit) {
      await stall(3000);
      const productUrlSelector = document.querySelectorAll('a[data-v-c701e340]');
      productUrlSelector.forEach(element => {
        if (!(productUrl.includes(element.href))) {
          productUrl.push(element.href);
        }
      });
      scrollTop += 1006;
      window.scroll(0, scrollTop);
    }
    productUrl.forEach(url => {
      document.querySelectorAll('div.productinfo')[j].setAttribute('producturl', url);
      console.log(url);
      j++;
    });
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
