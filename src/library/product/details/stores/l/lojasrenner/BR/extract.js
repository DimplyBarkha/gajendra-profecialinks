const {transform} = require('../shared')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrenner',
    transform,
    domain: 'lojasrenner.com',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  
  await context.evaluate(async (parentInput) => {

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
     let descElement1;
     let description1 = document.querySelector('div.desc');
     descElement1 = description1 ? description1.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
     addElementToDocument('bb_description',descElement1);
     let productAvaibility;
     let notAvailable = document.querySelector('div.product_404');
     if(notAvailable){
      productAvaibility = 'Out of Stock';
     }
     let available = document.querySelector('button.buy_button.js-buy');
     if(available){
      productAvaibility = 'In Stock';
     }
     addElementToDocument('bb_availibility',productAvaibility);
    });
    return await context.extract(productDetails, { transform });
    }
