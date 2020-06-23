
/**
 *
 * @param { { } } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
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

    const descBulletSelector = document.querySelector('section[id="information"] div[class="Layout-golden-main"]');
    // @ts-ignore
    let descBullet = descBulletSelector ? descBulletSelector.innerText : '';
    descBullet = descBullet ? descBullet.split('\n') : '';
    let descBulletCnt = 0;
    for (let i = 0; i < descBullet.length; i++) {
      if (descBullet[i].startsWith('-')) descBulletCnt++;
    }
    if (descBulletCnt) addHiddenDiv('ii_descBulletCnt', descBulletCnt);

    const brandURLSelector = document.querySelector('a[class*="features-brand"]');
    // @ts-ignore
    const brandURL = brandURLSelector ? brandURLSelector.href : '';
    if (brandURL) addHiddenDiv('ii_brandURL', brandURL);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    transform: null,
    domain: 'feelunique.com',
  },
  implementation,
};
