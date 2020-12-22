
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'jdsports.co.uk',
    store: 'jdsports',
    zipcode: '',
  },
  implementation,
};

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

    const categories = document.querySelectorAll('ul#nav-menu > li ');
    categories.forEach(element => {
      if (element.innerText === 'JD Now' || element.innerText === 'Offers' || element.innerText === 'JD Blog') {
      } else {
        const categoryName = element.innerText;
        const categoryUrl = element.firstChild.nextSibling.href;
        const subCategories = element.querySelectorAll('div.nav-panel > div > div > ul > li > a');
        subCategories.forEach(subCategory => {
          const newDiv = addHiddenDiv('categories', '');
          addHiddenDiv('category', categoryName, newDiv);
          addHiddenDiv('categoryUrl', categoryUrl, newDiv);
          addHiddenDiv('category', subCategory.innerHTML, newDiv);
          addHiddenDiv('categoryUrl', subCategory.href, newDiv);
        });
      }
    });
    // const categoryArr = [];
    // const subCategories = [];

    // const categories = document.querySelectorAll('ul#nav-menu > li > a')
    // categories.forEach(element => {
    //   if (element.innerText === 'JD Now' || element.innerText === 'Offers' || element.innerText === 'JD Blog') {
    //   } else {
    //     const categoryName = element.innerText;
    //     const categoryUrl = element.href;
    //     const subCategories = element.querySelectorAll('div.nav-panel > div > div > ul > li > a');

    //     subCategories.forEach((subCategory) => {
    //       // const subCategoriesList = subCategory.innerHTML;
    //       const subCategoryUrl = subCategory.href;

    //       categoryName.forEach((category) => {
    //         const newDiv = addHiddenDiv('categories', '');
    //         addHiddenDiv('category', category, newDiv);
    //         addHiddenDiv('categoryUrl', categoryUrl, newDiv);

    //         subCategories.forEach((subCategory) => {
    //           addHiddenDiv('categoryUrl', subCategoryUrl, newDiv);
    //           addHiddenDiv('category', subCategory.innerHTML, newDiv);
    //         });
    //       });
    //     },
    //     );
    //   }
    // });
  });
  return await context.extract(productMenu);
}
