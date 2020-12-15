async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  const categoriesPresent = await context.evaluate(async () => {
    return document.querySelector('ul[class="categories"]') !== null;
  });

  if (categoriesPresent) {
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
      const mainCategories = document.querySelectorAll('ul[class="categories"] li[class="level0"]');
      mainCategories.forEach(categoryNode => {
        const category = categoryNode.querySelector('a');
        const newCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);
  
        // subcategories
        const subCategories = categoryNode.querySelectorAll('li[class="level1"] a');
        subCategories.forEach(subCategory => {
          const newSubCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', category.textContent, newSubCatDiv);
          addHiddenDiv('category', subCategory.textContent, newSubCatDiv);
          addHiddenDiv('categoryUrl', subCategory.getAttribute('href'), newSubCatDiv);
  
          //subsubcategories
          const subSubCategories = subCategory.parentElement.querySelectorAll('li[class="level2"] a');
          subSubCategories.forEach(subsubCategory => {
            const newSubSubCatDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', category.textContent, newSubSubCatDiv);
            addHiddenDiv('category', subCategory.textContent, newSubSubCatDiv);
            addHiddenDiv('category', subsubCategory.textContent, newSubSubCatDiv);
            addHiddenDiv('categoryUrl', subsubCategory.getAttribute('href'), newSubSubCatDiv);
          });
        });
      });
      const extraCategories1 = document.querySelectorAll('ol[class="nav-primary"] li[class="level0"]');
      extraCategories1.forEach(categoryNode => {
        const category = categoryNode.querySelector('a');
        const newCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);
      });
      const extraCategories2 = document.querySelectorAll('ol[class="nav-primary"] li[class*="nav-sale"]');
      extraCategories2.forEach(categoryNode => {
        const category = categoryNode.querySelector('a');
        const newCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);
      });
    });
  } else {
    throw new Error('No categories found');
  }
  return await context.extract(productMenu);
};

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BR',
    domain: 'sephora.com.br',
    store: 'sephora',
    zipcode: '',
  },
  implementation,
};
