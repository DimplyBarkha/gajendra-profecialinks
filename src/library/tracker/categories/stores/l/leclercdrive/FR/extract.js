
async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
 /*  await context.clickAndWaitForNavigation('.divWPAD385CartoucheInfo')
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  await context.clickAndWaitForNavigation('.aWDMA016_RedirectionMagasin.bouton.bouton-bleu')
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  await context.waitForSelector('.recaptcha-checkbox-checkmark')
  await context.click('.recaptcha-checkbox-checkmark')

  await new Promise((resolve, reject) => setTimeout(resolve, 150000)); */
  await context.waitForSelector('.bandeau-lien.estRayons.js-ouvreRayons')
  
  await context.click('.bandeau-lien.estRayons.js-ouvreRayons')
  await context.evaluate(async function () {
    const menu = document.querySelector('.bandeau-lien.estRayons.js-ouvreRayons')
    menu.click()
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

    const mainCategories = document.querySelectorAll(
      'aside > ul > .rayon > a',
    );
    addHiddenDiv('test', '')
    mainCategories.forEach((category) => {
      addHiddenDiv('test', category.textContent)
      // @ts-ignore
      const mainCategoryId = category.getAttribute('data-rayon');
      const mainCategoryName = category.textContent;
      console.log('inside main')
      const categoriesList = document.querySelector(
          `li[data-rayon='${mainCategoryId}']`,
      ).querySelectorAll('ul > li > a');
        console.log(categoriesList)
      categoriesList.forEach((category) => {
        const newDiv = addHiddenDiv('categories', '');
        const categoryName = category.querySelector('span')
        const altCategoryName = category.querySelector('img')
        addHiddenDiv('category', mainCategoryName, newDiv);
        // @ts-ignore
        if(categoryName) {
        addHiddenDiv('category', categoryName.textContent, newDiv);
        } else { addHiddenDiv('category', altCategoryName.alt, newDiv)}
        // @ts-ignore
        addHiddenDiv('categoryUrl', category.href, newDiv);
      });
    });
  });

  return await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'leclercdrive.fr',
    store: 'leclercdrive',
    zipcode: '',
  },
  implementation,
};
