
const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function (inputs) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    

    function addEleToDoc (node,key, value) {
      const prodEle = document.createElement('div');
      prodEle.id = key;
      prodEle.textContent = value;
      prodEle.style.display = 'none';
      node.appendChild(prodEle);
    }

    document.querySelectorAll('a.productMainLink > div > div').forEach(rating => {
      var rating1 = rating.getAttribute('data-rating').replace('.',',');
      console.log(rating.innerText);
      if(rating)
      {
        rating.innerText=rating1;
      }
      
    });

    document.querySelectorAll('div.price_container > p.price').forEach(price => {
      var price1 = price.innerText;
      if(price1.length>10)
      {
        
        var pr1 = String(price1).split(" ");
        console.log(pr1[1])
        price.setAttribute('id',pr1[1]);
        
      }
      else{
        console.log(price1)
        price.setAttribute('id',price1);
        
      }
      
    });

    const searchUrl = window.location.href;
    document.querySelectorAll('.productgridcontainer .prod_grid').forEach(product => {
      addEleToDoc(product,'searchUrl',searchUrl);
    });
  });
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'dia',
    transform: transform,
    // transform,
    // transform: null,
    domain: 'dia.es',
    zipcode: '',
  },
  implementation,
  
};
