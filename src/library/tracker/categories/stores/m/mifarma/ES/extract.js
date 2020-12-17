
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
      "ol.nav-primary > li > div"
    );
    mainCategories.forEach((category) => {
      // @ts-ignore
      const mainCategoryName = category.textContent;
      
        const categoriesList = category.nextElementSibling.querySelectorAll(
          "li > div > a"
        ); 
        categoriesList.forEach((category) => {
          const newDiv = addHiddenDiv("categories", "");

          addHiddenDiv("category", mainCategoryName, newDiv);
          //@ts-ignore
          addHiddenDiv("category", category.textContent, newDiv);
          //@ts-ignore
          addHiddenDiv("categoryUrl", category.href, newDiv);
        });
      
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'ES',
    domain: 'mifarma.es',
    store: 'mifarma',
    zipcode: '',
  },
  implementation
};
