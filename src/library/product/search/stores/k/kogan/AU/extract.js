//const { transform } = require('../../../../shared');
const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    let tempUrl ='';
    let tempCheck = document.evaluate('//link[@rel="canonical"]//@href', document).iterateNext();      
    if(tempCheck !=null)
    {
      tempUrl = document.evaluate('//link[@rel="canonical"]//@href', document).iterateNext().textContent.trim();                        
    }
    
    if (tempUrl.indexOf('kogan.com') === -1) {
      tempUrl = "https://www.kogan.com" + tempUrl;
    }
    
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('tempWebUrl-id');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }

    let i = 0;
    document.querySelectorAll('div.rs-infinite-scroll > div._3dbuB').forEach(node => {    
      console.log(node);      
      addHiddenDiv(node,'tempWebUrl',tempUrl);
      i++;
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'kogan',
    transform,
    domain: 'kogan.com',
    zipcode: '',
  },    
  implementation
};
