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

    // categories
    const mainCategories = document.querySelectorAll('li.allProducts li.verticalMenuOption');
    mainCategories.forEach(categoryNode => {
      const category = categoryNode.querySelector('a');
      const newCatDiv = addHiddenDiv('categories', '');
      addHiddenDiv('category', category.textContent, newCatDiv);
      addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);

      // subcategories
      const subCategories = categoryNode.querySelectorAll('li.allProducts li.verticalMenuOption ul>li>a');
      subCategories.forEach(subCategory => {
        const newSubCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newSubCatDiv);
        addHiddenDiv('category', subCategory.textContent, newSubCatDiv);
        addHiddenDiv('categoryUrl', subCategory.getAttribute('href'), newSubCatDiv);
      });
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'uk.rs-online.com',
    store: 'rs-online',
    zipcode: '',
  },
  implementation,
};
