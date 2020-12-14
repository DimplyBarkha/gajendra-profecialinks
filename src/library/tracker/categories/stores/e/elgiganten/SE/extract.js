async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await context.evaluate(async function () {
    const isPopupPresent = document.querySelector('button[aria-label="JAG GODKÄNNER"]');
    // @ts-ignore
    if (isPopupPresent) isPopupPresent.click();
  });
  await context.evaluate(async function () {
    function addHiddenDiv (id, content, parentDiv = null) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }
    // const main = document.querySelectorAll('div[class*="department-overview"]');
    const mainCategories = document.querySelectorAll('div[class*="department-overview"] h3');

    mainCategories.forEach(e => {
      // @ts-ignore
      const text = e.innerText;

      const ulList = e.nextElementSibling;
      if (ulList && ulList.childElementCount !== 0) {
        const subCat = ulList.querySelectorAll('li');
        if (subCat) {
          // @ts-ignore
          [...subCat].map(e => {
            const newDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', text.split('>').pop(), newDiv);
            addHiddenDiv('category', e.innerText, newDiv);
            addHiddenDiv('categoryUrl', e.querySelector('a').getAttribute('href'), newDiv);
          });
        }
      }
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'SE',
    domain: 'elgiganten.se',
    store: 'elgiganten',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
