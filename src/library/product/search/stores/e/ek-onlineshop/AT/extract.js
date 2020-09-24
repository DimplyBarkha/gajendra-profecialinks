const { transform } = require('./../../../../shared');

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
    let tempCheck = document.evaluate('//ul[contains(@class,"page-list")]//li[@class="current"]//a//@href', document).iterateNext();      
    if(tempCheck !=null)
    {
      tempUrl = document.evaluate('//ul[contains(@class,"page-list")]//li[@class="current"]//a//@href', document).iterateNext().textContent.trim();                        
    }

    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('tempWebUrl-id');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }

    let i = 0;
    document.querySelectorAll('div.laberProductGrid > div.row > div.item-inner').forEach(node => {
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
    country: 'AT',
    store: 'ek-onlineshop',
    transform,
    domain: 'ek-onlineshop.at',
    zipcode: '',
  },
  implementation
};
