const { transform } = require('../../../../shared');

async function implementation (inputs,
  parameters,
  context,
  dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(()=>{
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    let mySearchUrl = document.querySelector('#searchUrl');
    let currentURL = window.location.href.split('#')[0];
    mySearchUrl ? mySearchUrl.textContent = currentURL : addHiddenDiv('searchUrl',currentURL);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    transform,
    domain: 'elcorteingles.es',
  },
  implementation
};
