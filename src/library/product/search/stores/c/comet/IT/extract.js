const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function preparePage () {
    // @ts-ignore
    document.querySelector("i[class*='popup']") && document.querySelector("i[class*='popup']").click();
    function addInsideProductNode (id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll("div[class*='sotto-cat__products__item'] reevoo-badge")[index];
      originalDiv.appendChild(newDiv);
    }
    const productNodes = document.querySelectorAll("div[class*='sotto-cat__products__item'] reevoo-badge");
    for (let i = 0; i < productNodes.length; i++) {
      const iframeNode = (productNodes[i].querySelector('iframe')) ? productNodes[i].querySelector('iframe').contentDocument.documentElement.innerHTML : null;
      const domparser = new DOMParser();
      if (iframeNode) {
        const iframeDOM = domparser.parseFromString(iframeNode, 'text/html');
        const rating = iframeDOM.querySelector('reevoo-stars').getAttribute('data-score');
        console.log('Rating ', rating);
        addInsideProductNode('ii_rating', rating, i);
      }
      const url = window.location.href;
      addInsideProductNode('added-searchurl', url, i);
    }
  }
  await context.evaluate(preparePage);
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'comet',
    transform,
    domain: 'comet.it',
    zipcode: '',
  },
  implementation,
};
