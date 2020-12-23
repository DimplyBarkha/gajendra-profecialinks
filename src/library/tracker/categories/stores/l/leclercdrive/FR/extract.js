
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  //TODO: captcha    
  await context.click('.bandeau-lien.estRayons.js-ouvreRayons')
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

    const mainCategories = document.querySelectorAll(
      'aside > ul > .rayon > a',
    );
    mainCategories.forEach((category) => {
      // @ts-ignore
      const mainCategoryId = category.getAttribute('data-rayon');
      const mainCategoryName = category.textContent;

      const categoriesList = document.querySelector(
          `li[data-rayon=${mainCategoryId}]`,
      ).querySelectorAll('ul > li > a');

      categoriesList.forEach((category) => {
        const newDiv = addHiddenDiv('categories', '');
        const categoryName = category.querySelector('span').textContent;
        addHiddenDiv('category', mainCategoryName, newDiv);
        // @ts-ignore
        addHiddenDiv('category', categoryName, newDiv);
        // @ts-ignore
        addHiddenDiv('categoryUrl', category.href, newDiv);
      });
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'leclercdrive.fr',
    store: 'leclercdrive',
    zipcode: '',
  },
  implementation,
};
