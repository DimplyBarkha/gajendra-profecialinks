async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await context.evaluate(async () => {
    function addProp (name, prop) {
      let j = 0;
      prop.forEach(element => {
        document.querySelectorAll('.productinfo')[j].setAttribute(name, element);
        j++;
      });
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    const productUrl = [];
    const name = [];
    const productId = [];
    const image = [];
    let k = 0;
    // scroll

    let scrollTop = 0;
    const scrollLimit = 10000;
    await stall(3000);
    while (scrollTop <= scrollLimit) {
      const productSelectorURL = document.querySelectorAll('a[data-v-c701e340]');
      productSelectorURL.forEach(element => {
        if (!(productUrl.includes(element.href))) {
          productUrl.push(element.href);
          name.push(productUrl[k].match('[^/]*$'));
          k++;
        }
      });
      const productSelectorID = document.querySelectorAll('div.mq-grid-item>article');
      productSelectorID.forEach(element => {
        if (!(productId.includes(element.id))) {
          productId.push(element.id);
        }
      });
      const productSelectorImage = document.querySelectorAll('.mq-product-img img');
      productSelectorImage.forEach(element => {
        if (!(image.includes(element.src))) {
          image.push(element.src);
        }
      });
      scrollTop += 1006;
      window.scroll(0, scrollTop);
      await stall(1000);
    }

    for (let i = 0; i < productUrl.length; i++) {
      const productInfo = document.createElement('div');
      productInfo.className = 'productinfo';
      document.body.appendChild(productInfo);
    };

    addProp('producturl', productUrl);
    addProp('id', productId);
    addProp('image', image);
    addProp('name', name);

    const rank = document.querySelectorAll('.productinfo');
    let i = 1;
    rank.forEach(number => {
      number.setAttribute('rank', `${i}`);
      i++;
    });

    const response = await fetch('https://merqueo.com/api/3.1/stores/63/search?q=leche&page=1&per_page=50&');
    const data = await response.json();

    for (i = 0; i < data.data.length; i++) {
      let price = data.data[i].attributes.price;
      price = '$' + price;
      document.querySelectorAll('.productinfo')[i].setAttribute('price', price);
    };
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
