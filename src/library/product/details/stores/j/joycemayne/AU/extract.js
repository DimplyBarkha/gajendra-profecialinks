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
  if (inputs.id) {
    const searchUrl = `https://www.joycemayne.com.au/catalogsearch/result/?q=${inputs.id}`;
    await context.goto(searchUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      if (document.querySelector('div[id="category-grid"] div:first-child a')) {
        document.querySelector('div[id="category-grid"] div:first-child a').click();
        await stall(4500);
      }
    });
    // const url = `https://grocery.walmart.com/v3/api/products/${id}?itemFields=all&storeId=5260`;
  }

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Scrolling till footer as manufacturer images are loaded on website after scrolling down
    await new Promise(resolve => setTimeout(resolve, 5000));
    async function scrollToLoadAplusImages () {
      let scrollSelector = document.querySelector('footer[class="footer"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 400;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[class="footer"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    await scrollToLoadAplusImages();

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.querySelector('div[class="box-description cms"] img');
    const descriptionSelector = document.querySelector('div[class="box-description cms"]');
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    if (manufacturerImageFlag) {
      description = description ? description.replace(/(\n\s*){1,}/g, ' || ') : '';
      description = description ? description.replace(/\|\| Key Features/gm, 'Key Features') : '';
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      const descContent = document.querySelector('div[class="box-description cms"]') ? document.querySelector('div[class="box-description cms"]').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      addHiddenDiv('added-description', descContent);
    }
  });

  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'joycemayne',
    transform,
    domain: 'joycemayne.com.au',
    zipcode: '',
  },
  implementation,
};
