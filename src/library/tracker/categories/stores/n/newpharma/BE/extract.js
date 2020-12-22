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
    const mainCategories = document.querySelectorAll('li');
    mainCategories.forEach(categoryNode => {
      if (categoryNode.className === 'l1') {
        const category = categoryNode.querySelector('a');
        const newCatDiv = addHiddenDiv('categories', '');
        addHiddenDiv('category', category.textContent, newCatDiv);
        addHiddenDiv('categoryUrl', category.getAttribute('href'), newCatDiv);

        // subcategories
        let nextSubCategory = categoryNode.nextElementSibling;
        while (nextSubCategory !== null && nextSubCategory.className === 'l2') {
          const subcategory = nextSubCategory.querySelector('a');
          const newSubCatDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', category.textContent, newSubCatDiv);
          addHiddenDiv('category', subcategory.textContent, newSubCatDiv);
          addHiddenDiv('categoryUrl', subcategory.getAttribute('href'), newSubCatDiv);

          // subsubcategories
          let nextSubSubCategory = nextSubCategory.nextElementSibling;
          while (nextSubSubCategory !== null && nextSubSubCategory.className === 'l3') {
            const subsubcategory = nextSubSubCategory.querySelector('a');
            const newSubCatDiv = addHiddenDiv('categories', '');
            addHiddenDiv('category', category.textContent, newSubCatDiv);
            addHiddenDiv('category', subcategory.textContent, newSubCatDiv);
            addHiddenDiv('category', subsubcategory.textContent, newSubCatDiv);
            addHiddenDiv('categoryUrl', subsubcategory.getAttribute('href'), newSubCatDiv);

            // subsubsubcategories
            let nextSubSubSubCategory = nextSubSubCategory.nextElementSibling;
            while (nextSubSubSubCategory !== null && nextSubSubSubCategory.className === 'l4') {
              const subsubsubcategory = nextSubSubSubCategory.querySelector('a');
              const newSubCatDiv = addHiddenDiv('categories', '');
              addHiddenDiv('category', category.textContent, newSubCatDiv);
              addHiddenDiv('category', subcategory.textContent, newSubCatDiv);
              addHiddenDiv('category', subsubcategory.textContent, newSubCatDiv);
              addHiddenDiv('category', subsubsubcategory.textContent, newSubCatDiv);
              addHiddenDiv('categoryUrl', subsubsubcategory.getAttribute('href'), newSubCatDiv);

              // subsubsubsubcategories
              let nextSubSubSubSubCategory = nextSubSubSubCategory.nextElementSibling;
              while (nextSubSubSubSubCategory !== null && nextSubSubSubSubCategory.className === 'l5') {
                const subsubsubsubcategory = nextSubSubSubSubCategory.querySelector('a');
                const newSubCatDiv = addHiddenDiv('categories', '');
                addHiddenDiv('category', category.textContent, newSubCatDiv);
                addHiddenDiv('category', subcategory.textContent, newSubCatDiv);
                addHiddenDiv('category', subsubcategory.textContent, newSubCatDiv);
                addHiddenDiv('category', subsubsubcategory.textContent, newSubCatDiv);
                addHiddenDiv('category', subsubsubsubcategory.textContent, newSubCatDiv);
                addHiddenDiv('categoryUrl', subsubsubsubcategory.getAttribute('href'), newSubCatDiv);

                nextSubSubSubSubCategory = nextSubSubSubSubCategory.nextElementSibling;
              }
              nextSubSubSubCategory = nextSubSubSubSubCategory;
            }
            nextSubSubCategory = nextSubSubSubCategory;
          }
          nextSubCategory = nextSubSubCategory;
        }
      }
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BE',
    domain: 'newpharma.be',
    store: 'newpharma',
    zipcode: '',
  },
  implementation,
};
