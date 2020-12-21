async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

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
      '.container.header__nav-list .header__nav-item > a',
    );
    mainCategories.forEach((category) => {
      // @ts-ignore
      const mainCategoryName = category.textContent;
      if (category.nextElementSibling) {
        const subCategories = category.nextElementSibling.querySelectorAll(
          '.row ul > li > a',
        );
        subCategories.forEach((subCategory) => {
          const subCategoryTitle = subCategory.textContent;
          const newDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', mainCategoryName, newDiv);
          addHiddenDiv('category', subCategoryTitle, newDiv);
          addHiddenDiv('categoryUrl', subCategory.href, newDiv);
        });
      }
    });
  },
  );
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'RU',
    domain: 'eapteka.ru',
    store: 'eapteka',
    zipcode: '',
  },
  implementation,
};
