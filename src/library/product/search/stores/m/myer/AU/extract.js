const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(8000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
    const arr = document.querySelectorAll('li.css-1s2ihhj');
    for (let i = 0; i < arr.length; i++) {
      addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
    }
    localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
  });

  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll('li.css-1s2ihhj');
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);
  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform: null,
    domain: 'myer.com.au',
    zipcode: '',
  },
  implementation,
};
