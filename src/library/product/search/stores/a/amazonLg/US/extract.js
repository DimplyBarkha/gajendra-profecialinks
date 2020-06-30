const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    transform: transform,
    domain: 'amazon.com',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    const url = window.location.href;
    document.querySelectorAll('span[cel_widget_id="MAIN-SEARCH_RESULTS"]').forEach(node => {
      addHiddenDiv(node, 'ii_url', url);
      addHiddenDiv(node, 'ii_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
    });
  });
  return await context.extract(productDetails, { transform });
}
