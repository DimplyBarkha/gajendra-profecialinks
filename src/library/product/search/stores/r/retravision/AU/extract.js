const { transform } = require('../../../../shared');


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
    let tempCheck = document.evaluate('//li[contains(@class,"ais-pagination--item ais-pagination--item__page ais-pagination--item__active")]//a//@href', document).iterateNext();      
    if(tempCheck !=null)
    {
      tempUrl = document.evaluate('//li[contains(@class,"ais-pagination--item ais-pagination--item__page ais-pagination--item__active")]//a//@href', document).iterateNext().textContent.trim();                        
    }
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('tempWebUrl-id');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }

    let i = 0;
    document.querySelectorAll('div.ais-hit').forEach(node => {    
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
    store: 'retravision',
    transform,
    domain: 'retravision.com.au',
    zipcode: '',
  },
  implementation
};
