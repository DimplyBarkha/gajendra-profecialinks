const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform,
    domain: 'myer.com.au',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) 
  
  {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    try {
      await context.waitForSelector('div[class="rec_name"]', { timeout: 10000 });
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));

      console.log('selector of inTheBox exist');
    } catch (e) {
      console.log("selector of inTheBox doesn't exist");
    }
    
    try{
      await context.evaluate(function () {
        let tmp=JSON.stringify(window.__NEXT_DATA__).replace(/.*"selectedVariant":{"id":"(.*?)".*/,'$1');
        const newDiv = document.createElement('div');
          newDiv.id = 'customselectedVariantDiv';
          newDiv.textContent = tmp;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
      })
    }catch(e){

    }
    return await context.extract(productDetails, { transform });
  },
};
