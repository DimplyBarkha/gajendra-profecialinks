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
    await context.evaluate(async() => {
      let scrollTop = 0;
      while (scrollTop <= 30000) {
        await stall(100);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 30000) {
          await stall(3000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }


      try{
        // const siteUrl = window.location.href;
        const items = document.querySelectorAll('.box-produto');
        console.log(items);
        items.forEach(item => {
          const firstPricePart = item.querySelector('.box-produto__preco__valor')
                                ? item.querySelector('.box-produto__preco__valor').textContent
                                : '';
          const secondPricePart = item.querySelector('.box-produto__preco__centavos')
                                  ? item.querySelector('.box-produto__preco__centavos').textContent
                                  : '';
          item.setAttribute('generated-pirce', `${firstPricePart}${secondPricePart}`);
          // item.setAttribute('generated-url', siteUrl);
        });
      }catch(e){
        console.log('Something went wrong', e);
      }
    });
    // await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    return await context.extract(productDetails, {transform});
  },
};
