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
      ".nav__links.nav__links--products.js-offcanvas-links > li > nav > ul > li > a"
    );
    mainCategories.forEach((category) => {
      // @ts-ignore
      const mainCategoryName = category.querySelector("span").textContent;
      const subCategories = category.nextElementSibling.querySelectorAll(
        "ul > .with-sub > a"
      );
      subCategories.forEach((subCategory) => {
        const subCategoryTitle = subCategory.textContent
        console.log(subCategory)
        const categoriesList = subCategory.nextElementSibling.querySelectorAll(
          "li > a"
        ); 
        console.log(categoriesList)
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
    country: "TR",
    domain: "teknosa.com",
    store: "teknosa",
    zipcode: "",
  },
  implementation,
};
