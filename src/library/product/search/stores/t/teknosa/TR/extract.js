async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const addUrl = async function(context) {
    await context.evaluate(async function() {
       const url = document.location.href
       const productList = document.querySelectorAll('.product-item')
       productList.forEach(product => product.setAttribute('searchurl', url))
    })
    return;
  }
  const addRanking = async function (context) {
    await context.evaluate(async function () {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const arr = document.querySelectorAll('.product-item');
      for (let i = 0; i < arr.length; i++) {
        addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
    }); 
  };
  await addUrl(context)
  await addRanking(context);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    transform: null,
    domain: 'teknosa.com',
    zipcode: '',
  },
  implementation,
};
