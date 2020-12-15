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
      ".nav-produit.sub-nav > ul > li > a"
    );
    mainCategories.forEach((category) => {
      // @ts-ignore
      const mainCategoryName = category.title;
      const subCategories = category.nextElementSibling.querySelectorAll(
        ".yCmsComponent.dropdown"
      );
      subCategories.forEach((subCategory) => {
        const subCategoryTitle = subCategory.querySelector("a");
        const categoriesList = subCategory.parentElement.querySelectorAll(
          ".yCmsComponent.leaf-node > a"
        );
        categoriesList.forEach((category) => {
          const newDiv = addHiddenDiv("categories", "");

          addHiddenDiv("category", mainCategoryName, newDiv);
          addHiddenDiv("category", subCategoryTitle.title, newDiv);
          //@ts-ignore
          addHiddenDiv("category", category.title, newDiv);
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
    country: "FR",
    domain: "marionnaud.fr",
    store: "marionnaud",
    zipcode: "",
  },
  implementation,
};
