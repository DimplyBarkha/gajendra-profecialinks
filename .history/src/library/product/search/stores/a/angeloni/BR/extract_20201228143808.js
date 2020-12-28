const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'angeloni',
    transform,
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    // await context.setJavaScriptEnabled(true);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.evaluate(async() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }


      const siteUrl = window.location.href;
      const items = document.querySelectorAll('.box-produto');
      console.log(items);
      items.forEach(item => {
        console.log(item.querySelector('.box-produto__preco__centavos);
        // const firstPricePart = item.querySelector('.box-produto__preco__valor').textContent;
        // const secondPricePart = item.querySelector('.box-produto__preco__centavos').textContent || '';
        // item.setAttribute('generated-pirce', `${firstPricePart}${secondPricePart}`);
        // item.setAttribute('generated-url', siteUrl);
      })
    })
    return await context.extract(productDetails, {transform});
  },
};
