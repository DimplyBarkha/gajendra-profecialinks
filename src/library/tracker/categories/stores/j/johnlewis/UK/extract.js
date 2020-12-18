
module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'UK',
    domain: 'johnlewis.com',
    store: 'johnlewis',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async (inputs, properties, context, { productMenu }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const cookies = document.querySelector('div[data-test="cookie-banner"] button[data-test="allow-all"]');
      // @ts-ignore
      if (cookies) cookies.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      const getCategoriesArray = (categoriesObj) => {
        /**
         * A recursive function extracting categories names and their URL's and
         * pushing them as objects to the 'resultArr'.
         * @param {Object} node At first iteration this is our fetched 'categoriesObj'.
         * Then, at each recursive call it goes deeper and another child of the
         * provided 'node' is taken as the function input.
         * @param {Array} resultArr an empty array to store the function output
         */
        const getCategories = (node, resultArr) => {
          if (typeof node === 'object' && node !== null) {
            for (let i = 0; i < Object.keys(node).length; i++) {
              const obj = Object.values(node)[i];
              // Checking if the current 'obj' object has these keys present.
              // If so we create an object out of them and push them to the 'resultArr'.
              if (obj && Object.keys(obj).includes('title') &&
                Object.keys(obj).includes('href')
              ) {
                if (obj.href !== null && !obj.href.includes('https://www.johnlewis.com/')) {
                  resultArr.push({ name: obj.title, url: obj.href });
                }
              }
              // We call the function again passing the current 'obj' object to go 'deeper'.
              getCategories(obj, resultArr);
            }
          }
        };
        const resultArr = [];
        getCategories(categoriesObj, resultArr);
        return resultArr;
      };

      const menuButton = document.querySelector('a[aria-controls="main-navigation-menu"] span');
      // @ts-ignore
      if (menuButton) menuButton.click();
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      await stall(2000);
      const addedCatList = document.createElement('ul');
      addedCatList.id = 'added_categories_list';
      addedCatList.style.display = 'none';
      document.body.appendChild(addedCatList);

      const categoriesLevelUp = document.querySelectorAll('ul[class*="navigation-navBar"] li[class*="navigation-item-item--level0"] >a');
      if (categoriesLevelUp.length) {
        for (let i = 0; i < categoriesLevelUp.length; i++) {
          const categoryElem = categoriesLevelUp[i];
          // @ts-ignore
          if (categoryElem.getAttribute('href') && categoryElem.innerText !== 'Read The Edit') {
            const listItem = document.createElement('li');
            // @ts-ignore
            const categoryName = categoryElem.innerText ? categoryElem.innerText : '';
            const categoryUrl = categoryElem.getAttribute('href') ? categoryElem.getAttribute('href').replace(/(^\/)/, 'https://www.johnlewis.com/') : '';
            listItem.setAttribute('category', categoryName);
            listItem.setAttribute('categoryUrl', categoryUrl);
            addedCatList.appendChild(listItem);
          }
        }
      }

      const mainCategoriesIds = [];
      const urlsList = [];
      const categoriesLevel1 = document.querySelectorAll('ul[class*="navigation-navBar"] li[class*="navigation-item-item--level0"] >a');
      for (let i = 0; i < categoriesLevel1.length; i++) {
        const categoryUrl = categoriesLevel1[i].getAttribute('href') ? categoriesLevel1[i].getAttribute('href') : null;
        const categoryId = categoryUrl && categoryUrl.match(/\/\w(\d+)$/) ? categoryUrl.match(/\/\w(\d+)$/)[1] : null;
        if (categoryId) mainCategoriesIds.push(categoryId);
      }

      for (let i = 0; i < mainCategoriesIds.length; i++) {
        const fetchedCategories = await fetch(`https://www.johnlewis.com/header/api/categories/${mainCategoriesIds[i]}?depth=4&host=www.johnlewis.com&subset=mobileSite`, {
          referrer: 'https://www.johnlewis.com/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
        }).then((resp) => resp.json())
          .catch((err) => {
            console.log(err);
            throw new Error('Failed to fetch the categories object.');
          });

        const subCategoriesArr = getCategoriesArray(fetchedCategories);
        const addedCatList = document.createElement('ul');
        addedCatList.id = 'added_categories_list';
        addedCatList.style.display = 'none';
        document.body.appendChild(addedCatList);

        subCategoriesArr.forEach((item) => {
          if (!urlsList.includes(item.url)) {
            const listItem = document.createElement('li');
            listItem.setAttribute('category', item.name);
            listItem.setAttribute('categoryUrl', `https://www.johnlewis.com/${item.url}`);
            addedCatList.appendChild(listItem);
            urlsList.push(item.url);
          }
        });
      }
    });

    await context.extract(productMenu);
  },
};
