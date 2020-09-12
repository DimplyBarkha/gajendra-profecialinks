const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const skuArr = await context.evaluate(function() {
      const resultArr = [];
       const items  = document.querySelectorAll('.product-item.product-card');
       for(let i = 0;i < items.length ; i++)
       {
          resultArr.push(items[i].getAttribute('data-test-id').replace('product-item:',''));
       }
       return resultArr;
    });
    if(skuArr){
      try {
    for(let i = 0; i < skuArr.length; i++){
      await context.evaluate(async function(sku){
          
        function addHiddenDiv(el, id, text) {
          const div = document.createElement('div');
          div.classList.add(id);
          div.innerHTML = text;
          el.appendChild(div);
        }   
        //https://mark.reevoo.com/reevoomark/product_summary?locale=en-GB&sku=330V8ANIMAL&trkref=ERN&variant=NewStars&callback=ReevooLib.Data.callbacks
      const response = await fetch(`https://mark.reevoo.com/reevoomark/product_summary?locale=en-GB&sku=${sku}&trkref=ERN&variant=NewStars&callback=ReevooLib.Data.callbacks`, {     
        method: 'GET'       
      });
  
      if (response && response.status === 404) {
        console.log('Reviews Not Found!!!!');
      }
  
      if (response && response.status === 200) {
        console.log('Review Found!!!!');
        let text = await response.text();
        text = text.substring(text.indexOf('{')).replace('})','}');
        console.log(text);
        const data = JSON.parse(text);
          let item = document.evaluate(`//div[@data-test-id="product-item:${sku}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if(item) {
          addHiddenDiv(item, 'rating', data.average_score/2);
          addHiddenDiv(item, 'reviews', data.review_count);
          addHiddenDiv(item, 'id', sku);
          }
        }
        
    }, skuArr[i]);
    }
  }
  catch(exception){
    console.log(exception)

  }
  }
   return context.extract(productDetails, { transform });  
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    transform: transform,
    domain: 'euronics.co.uk',
  },
  implementation,
};
