
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await context.evaluate(function() {

    function addHiddenDiv (className, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', className);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const primaryImageBaseUrl = document.querySelector('td.images td.base_url');
    const primaryImageUrl = document.querySelector('td.images td.primary');
    if(primaryImageBaseUrl && primaryImageUrl) {
      addHiddenDiv('primaryImage', primaryImageBaseUrl.innerText + primaryImageUrl.innerText);
    }

    const secondaryImageBaseUrl = document.querySelector('td.images td.base_url');
    let secondaryImageUrls = [];
    document.querySelectorAll('td.images td.image_url').forEach(e => {
      secondaryImageUrls.push(secondaryImageBaseUrl.innerText + e.innerText);
    });
    addHiddenDiv('secondaryImages', secondaryImageUrls.join(' | '));


  });

  await context.extract(productDetails, { transform });

}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: transform,
    domain: 'target.com',
  },
  implementation,
};
