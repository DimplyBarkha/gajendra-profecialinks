async function implementation(inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv(id, content, parentDiv = null) {
      const newDiv = document.createElement("div");
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = "none";
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }

    const mainCategories = document.querySelectorAll(
      '.list-style-none.flex.justify-content-center.align-items-center > .mega-menu__item > a'
    );
    mainCategories.forEach((category) => {
      // @ts-ignore
      const mainCategoryName = category.textContent;
      if (category.nextElementSibling) {
        const subCategories = category.nextElementSibling.querySelectorAll(
          ' ul > li > a'
        );
        subCategories.forEach((subCategory) => {
          const subCategoryTitle = subCategory.textContent;
          if (subCategory.nextElementSibling) {
            const categoriesList = subCategory.nextElementSibling.querySelectorAll(
              'ul > li > a'
            );
            categoriesList.forEach((category) => {
              const newDiv = addHiddenDiv("categories", "");
              addHiddenDiv("category", mainCategoryName, newDiv);
              addHiddenDiv("category", subCategoryTitle, newDiv);
              addHiddenDiv("category", category.textContent, newDiv);
              addHiddenDiv("categoryUrl", category.href, newDiv);
            });
          }
        });
      }
    });
  });

  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BR',
    domain: 'petlove.com.br',
    store: 'petlove',
    zipcode: '',
  },
  implementation,
};
