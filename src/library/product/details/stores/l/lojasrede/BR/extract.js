const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'lojasrede',
    transform: null,
    domain: 'lojasrede.com.br',
    zipcode: '',
  },
  implementation,
};

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {

    //for price value
    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('ul[class="neemu-products-container nm-view-type-grid"]>li')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
      const sliceURL = (data) => {
      for (let index = 0; index < data.length; index++) {    
      var temp;   
      if (data[index].includes(",")) {
      var temp = data[index].replace(",", ".");
      } else if (data[index].includes(" ")) {
      temp = data[index].replace(" ", "");
      } else {
      temp = data[index]
      }
      addHiddenDiv('zz', temp, index);
      }
      };
      var backgroundURL = getAllXpath("//*[contains(@class,'MuiCardContent-root')]/div/div/span[1]/text()", 'nodeValue');
      sliceURL(backgroundURL);
    });
    return await context.extract(productDetails, { transform });
  
}
