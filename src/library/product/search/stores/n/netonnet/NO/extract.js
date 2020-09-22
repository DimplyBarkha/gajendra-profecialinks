


const { transform } = require('./transform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('reviewRatings-id');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    let i = 0;
    document.querySelectorAll('div.bigHeader > div.rating > div.ratingBg > div.ratingOverlay').forEach(node => {
      var productTileObject =  node.attributes[1].value.trim();
      productTileObject = productTileObject.replace('width: ','');
      productTileObject = productTileObject.replace('%','');
      var reviewRatings = (Number(productTileObject)*5)/100;      
      addHiddenDiv(node,'reviewRatings',reviewRatings.toString().replace('.',','))
      i++;
    });
  });
  return await context.extract(productDetails, { transform });
}



module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    transform,
    domain: 'netonnet.no',
    zipcode: '',
  },
  implementation,
};
