
const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Scrolling till footer till all the image src is loaded
    await new Promise(resolve => setTimeout(resolve, 4000));
    async function scrollToLoadImageSrc () {
      let scrollSelector = document.querySelector('footer[id="footer"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[id="footer"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    }
    await scrollToLoadImageSrc();

    // Adding search url to DOM
    const searchURL = window.location.href;
    addHiddenDiv('added_search_url', searchURL);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'fnac',
    transform,
    domain: 'fnac.pt',
    zipcode: '',
  },
  implementation,
};
