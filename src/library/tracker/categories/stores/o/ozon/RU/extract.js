async function implementation (inputs, parameters, context, dependencies) {
  const { productMenu } = dependencies;
  let idsLength = 1;
  await context.evaluate(async function () {
    function addHiddenElem (className, content, elemTag = 'div', parentDiv = null) {
      const newDiv = document.createElement(elemTag);
      newDiv.className = className;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      if (parentDiv) {
        parentDiv.appendChild(newDiv);
      } else {
        document.body.appendChild(newDiv);
      }
      return newDiv;
    }

    const pageUrl = window.location.href.replace(/.$/, '');

    const catalogMainItems = document.querySelectorAll('.a0k9.c7c0.c7c2:not(.c7c4)');
    catalogMainItems.forEach((catalogMainItem, index) => {
      addHiddenElem('categoryName', catalogMainItem.textContent, 'div');
      const catalogIdItemHref = catalogMainItem.getAttribute('href');
      const categoryUrl = `${pageUrl}${catalogIdItemHref}`;
      addHiddenElem('categoryUrl', categoryUrl, 'div');
    });

    // Getting ids to subcategories
    const catIds = [];
    catalogMainItems.forEach((catalogIdItem, index) => {
      const catHref = catalogIdItem.getAttribute('href');
      const catId = catHref.replace(/\D/g, '');
      catIds.push(catId);
      idsLength = +index;
    });
    console.log(idsLength);

    // Fetch data from api with ids
    const apiUrl = 'https://www.ozon.ru/api/composer-api.bx/_action/categoryChildV2?menuId=1&categoryId=';
    async function getData (url = '') {
      const response = await fetch(url, {
        method: 'GET',
      });
      return response.json();
    }
    if (catIds) {
      catIds.forEach((id, index) => {
        const getUrl = `${apiUrl}${id}`;
        getData(getUrl)
          .then((data) => {
            if (data.brands) {
              data.brands.forEach(brandItem => {
                addHiddenElem('categoryName brand', brandItem.title, 'div');
                const categoryUrl = `${pageUrl}${brandItem.url}`;
                addHiddenElem('categoryUrl', categoryUrl, 'div');
              });
            }
            if (data.categories) {
              data.categories.forEach((catItem, index) => {
                addHiddenElem('categoryName subcat', catItem.title, 'div');
                const categoryUrl = `${pageUrl}${catItem.url}`;
                addHiddenElem('categoryUrl', categoryUrl, 'div');
                console.log(catItem);

                if (catItem.categories) {
                  catItem.categories.forEach(subCatItem => {
                    addHiddenElem('categoryName sub-subcat', subCatItem.title, 'div');
                    const categoryUrl = `${pageUrl}${subCatItem.url}`;
                    addHiddenElem('categoryUrl', categoryUrl, 'div');
                  });
                }
              });
            }
            return data;
          })
          .then(data => {
            addHiddenElem(`idsLoop-${index + 1}`, '', 'div');
          });
      });
    };
  });
  // await context.waitForXPath(`//div[contains(@class, "idsLoop-${idsLength}")]`);
  await context.waitForXPath('//div[contains(@class, "idsLoop-25")]');
  // await new Promise((resolve, reject) => setTimeout(resolve, 20000));

  return await context.extract(productMenu);
}
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'RU',
    domain: 'ozon.ru',
    store: 'ozon',
    zipcode: '',
  },
  implementation,
};
