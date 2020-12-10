const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  { transform: transformParam },
  context,
  dependencies,
) {
  //const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 30000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 30000) {
          await stall(6000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
    
      var added_baseurl = 'https://fetch.co.uk'; 
      addElementToDocument('added_base_url',added_baseurl);      
    });

    
    
  };
  
  

  await applyScroll(context);
  return await context.extract(productDetails, { transform: transformParam });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'fetch',
    transform: transform,
    domain: 'fetch.co.uk',
    zipcode: '',
  },
  implementation,
};
