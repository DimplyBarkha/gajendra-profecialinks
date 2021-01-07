
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  try {
    await context.waitForSelector('button[data-test="allow-all"]');
    await context.click('button[data-test="allow-all"]');
  } catch (e) {
    console.log('No cookies box');
  }

  try {
    await context.waitForSelector('section[data-test="product-card"] img');
    await context.click('h2[class*=title_title]');
    const a = await context.evaluate(() => {
      return (document.querySelector('section[data-test="product-card"] a').getAttribute('href'));
    });
    console.log(a);
    await context.waitForNavigation();
    await context.waitForSelector('.product-page img');
  } catch (err) {
    console.log('No result found');
  }
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    function getId (url) {
      const splits = url ? url.split('/p') : [];
      let id = (splits.length > 0) ? splits[splits.length - 1] : '';
      id = id.includes('?') ? id.split('?')[0] : id;
      return id;
    }

    const url = window.location.href;
    const nodes = document.querySelectorAll('ul.size-list li.size-small-item, ul.swatch-list li.swatch-list-item');
    const differentNodes = document.querySelectorAll('ul[data-cy="size-selector-list"] li input');
    if (nodes.length) {
      [...nodes].forEach((element) => {
        const prodUrl = element.querySelector('a') ? element.querySelector('a').href : null;
        if (prodUrl) {
          addHiddenDiv('ii_variantUrl', prodUrl);
          const id = getId(prodUrl);
          addHiddenDiv('ii_variant', id);
        }
      });
    } else if (differentNodes.length) {
      Array.from(differentNodes).forEach(el => {
        const id = el.getAttribute('id').replace(/\s/g, '-');
        const prodUrl = `${url}?size=${id}`;
        const prodId = getId(url) + id;
        addHiddenDiv('ii_variantUrl', prodUrl);
        addHiddenDiv('ii_variant', prodId);
      });
    } else {
      addHiddenDiv('ii_variantUrl', url);
      const id = getId(url);
      addHiddenDiv('ii_variant', id);
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    transform: null,
    domain: 'johnlewis.com',
    zipcode: '',
  },
  implementation,
};
