
const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // scrolling
    let scrollTop = 0;
    while (scrollTop <= 40000) {
      const productsContainer = document.querySelector('.df-results');
      console.log(productsContainer);

      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      productsContainer && productsContainer.scroll(0, scrollTop);
      if (scrollTop === 40000) {
        await stall(500);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    // rank
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    const lastProductPosition = localStorage.getItem('prodCount')
      ? Number(localStorage.getItem('prodCount'))
      : 1;
    const arr = document.querySelectorAll('.df-card.product-container');
    console.log('arr', arr);
    for (let i = 0; i < arr.length; i++) {
      addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
    }
    localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
  });

  await context.evaluate(async function () {
    const productList = document.querySelectorAll('.df-card.product-container');
    console.log('list', productList);
    const url = window.location.href;
    productList.forEach((product) => product.setAttribute('searchurl', url));
  });

  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'keshop',
    transform: null,
    domain: 'keshop.com',
    zipcode: '',
  },
  implementation,
};
