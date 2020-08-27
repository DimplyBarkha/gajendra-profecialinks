const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function (url) {

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Scrolling till specifications as manufacturer images are loaded on website after scrolling down
    await new Promise(resolve => setTimeout(resolve, 10000));
    async function scrollToLoadAplusImages () {
      let scrollSelector = document.querySelector('div[id="presContent"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('div[id="descContent"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    }
    await scrollToLoadAplusImages();

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.querySelector('div[id="inpage_container"] img');
    const descriptionSelector = document.querySelector('div[id="inpage_container"]');
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    description = description ? description.replace(/(\n\s*){1,}/g, ' || ') : '';
    // description = description ? description.replace(/\|\| Key Features/gm, 'Key Features') : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
  }, inputs.url);
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    transform,
    domain: 'cdiscount.com',
    zipcode: '',
  },
  implementation,
};
