const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
    const arr = document.querySelectorAll('.ais-hits > div');
    for (let i = 0; i < arr.length; i++) {
      addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
    }
    localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
  });

  await context.evaluate(() => {
    const rating = document.querySelectorAll('.rating');
    rating.forEach((el) => {
      const trimmed = el.style.width.slice(0, -1);
      let numericRate = String(trimmed / 20);
      numericRate = numericRate.replace(/\./g, ',');
      console.log(numericRate);
      el.setAttribute('numericrating', numericRate);
    });
  });
  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll('.ais-hits > div');
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
    country: 'ES',
    store: 'mifarma',
    transform: null,
    domain: 'mifarma.es',
    zipcode: '',
  },
  implementation,
};
