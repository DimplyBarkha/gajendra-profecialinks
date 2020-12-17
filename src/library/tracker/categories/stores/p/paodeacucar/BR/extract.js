
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
      ".category-menustyles__Section-sc-1f1zulv-7.gKUKvM:nth-of-type(4) div:not(:first-of-type)"
    );
    mainCategories.forEach((category) => {
      const mainCategoryName = category.textContent;
      const fixedCategoryName = mainCategoryName.toLowerCase().replaceAll(' ', '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const categoryUrl = 'https://www.paodeacucar.com/categoria/' + fixedCategoryName;
      const newDiv = addHiddenDiv("categories", "");
      addHiddenDiv("category", mainCategoryName, newDiv);
      addHiddenDiv("categoryUrl", categoryUrl, newDiv);
    });
  });
  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'BR',
    domain: 'paodeacucar.com',
    store: 'paodeacucar',
    zipcode: '',
  },
  implementation,
};
