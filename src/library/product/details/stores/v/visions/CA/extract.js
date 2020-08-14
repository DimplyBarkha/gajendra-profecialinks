const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  // await new Promise((resolve) => setTimeout(resolve, 30000));
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let descContent;
    if (document.querySelector("script[type*='application/ld+json']")) {
      // @ts-ignore
      const desc = (document.querySelector("script[type*='application/ld+json']")) ? document.querySelector("script[type*='application/ld+json']").innerText : '';
      const descJSON = (JSON.parse(desc)) ? JSON.parse(desc) : [];
      descContent = (descJSON && descJSON.description) ? descJSON.description.replace(/<.*?>|\\r|\\n|\t/gm, '') : '';
    }
    // @ts-ignore
    const enhancedContent = (document.querySelector('div#productdetail-tabs-overview')) ? document.querySelector('div#productdetail-tabs-overview').innerText : '';
    if (document.querySelector('div#productdetail-tabs-overview img') || document.querySelector("div[id='productdetail-tabs-overview'] center iframe")) {
      addHiddenDiv('ii_enhancedContent', enhancedContent);
    } else if (enhancedContent) {
      descContent = descContent.trim() + ' | ' + enhancedContent.trim();
    }
    addHiddenDiv('ii_description', descContent);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'visions',
    transform,
    domain: 'visions.ca',
    zipcode: '',
  },
  implementation,
};
