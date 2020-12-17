async function implementation(inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  await new Promise(r => setTimeout(r, 3000))
  
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
      ".m-navigation-side.js-nav-side > ul > .m-navigation-side__item.m-navigation-side__item--level-1.js-item-1 > span"
    );

     await mainCategories.forEach((category) => {
      // @ts-ignore
      const mainCategoryName = category.textContent;
      // such querySelector was used instead of li > div > ul > li > span, because span without ul lists are empty
       const subCategories = category.nextElementSibling.querySelectorAll(
        "li > ul > li > ul"
      ); 
       subCategories.forEach((subCategory) => {
        const subCategoryTitle = subCategory.parentElement.querySelector("span")
          .textContent;
        const categoriesList = subCategory.querySelectorAll(
          "li > span >  a"
        );
        categoriesList.forEach((category) => {
          const newDiv = addHiddenDiv("categories", "");

          addHiddenDiv("category", mainCategoryName, newDiv);
          addHiddenDiv("category", subCategoryTitle, newDiv);
          //@ts-ignore
          addHiddenDiv("category", category.textContent, newDiv);
          //@ts-ignore
          addHiddenDiv("categoryUrl", category.href, newDiv);
        });
      });   
     });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: "tracker/categories/extract",
  parameterValues: {
    country: "CH",
    domain: "manor.ch",
    store: "manor",
    zipcode: "",
  },
  implementation,
};
