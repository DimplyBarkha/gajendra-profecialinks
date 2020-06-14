const { transform } = require('./transform');
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

  async function getVariants () {
    const variants = await context.evaluate(function () {
      const variantList = [];
      const elements = document.querySelectorAll('li[data-defaultasin]');
      for (let i = 0; i < elements.length; i++) {
        console.log(i);
        const element = elements[i];
        if (element == null) {
          continue;
        }
        const vasin = element.getAttribute('data-defaultasin');
        if (vasin !== '') {
          variantList.push(vasin);
        }
      }

      return variantList;
    });
    return variants;
  };

  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let url = window.location.href;
    const splits = url ? url.split('/') : [];
    url = (splits.length > 0) ? splits[splits.length - 1] : '';
    addHiddenDiv('added-asin', url);
  }

  console.log('getting variants');
  const allVariants = await getVariants();
  // if( allVariants.length > 1 ) {
  //  allVariants.shift();
  // }
  await context.evaluate(addUrl);
  await context.extract(productDetails, { transform, type: 'APPEND' });
  console.log(allVariants);
  // start at 1 to skip the first variant which is this page
  for (let i = 1; i < allVariants.length; i++) {
    const id = allVariants[i];
    const url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });

    await context.evaluate(addUrl);
    await context.extract(productDetails, { transform, type: 'APPEND' });
    const pageVariants = await getVariants();
    for (let j = 0; j < pageVariants.length; j++) {
      const pageVariant = pageVariants[j];
      if (allVariants.indexOf(pageVariant) === -1) {
        allVariants.push(pageVariant);
        console.log('new variant: ' + pageVariant);
        console.log(allVariants);
      }
    }
  }

  // return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform: transform,
    domain: 'amazon.com',
  },
  implementation,
};
