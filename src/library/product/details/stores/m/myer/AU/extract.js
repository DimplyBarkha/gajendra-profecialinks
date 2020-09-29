const{cleanUp} = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content,divName) {
      const newDiv = document.createElement(divName);
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    var productpricewas = document.querySelectorAll('div[data-automation="product-price"] > p[data-automation="product-price-was"] > span')
    var productpricenow = document.querySelectorAll('div[data-automation="product-price"] > p[data-automation="product-price-now"] > span')
   if(productpricewas.item.length > 0)
    {
      if(productpricenow.item(1) == null)
      {
        addHiddenDiv(productpricewas.item(1),'online-price',productpricewas.item(1).textContent,'online-price')
      }
      else
      {
        addHiddenDiv(productpricewas.item(1),'list-price',productpricewas.item(1).textContent,'list-price')
        addHiddenDiv(productpricenow.item(1),'online-price',productpricenow.item(1).textContent,'online-price')
      }
    }    
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform: cleanUp,
    domain: 'myer.com.au',
    zipcode: '',
  },
  implementation,
};
