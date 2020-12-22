async function implementation (inputs, properties, context, { productMenu }) {
  await context.evaluate(async function () {
    function addObjectToDom (name, url) {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.id = 'category';
      div2.id = 'categoryUrl';
      div.innerHTML = name;
      div2.innerHTML = url;
      document.querySelector('body').appendChild(div);
      document.querySelector('body').appendChild(div2);
    }

    async function fetchUrl (url) {
      try {
        const fetchData = await fetch(url, {
          headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, b',
            'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'max-age=0',
          },
        }).then((resp) => resp.text());
        return fetchData;
      } catch (err) {
        console.log('blocked Fetch ' + err);
      }
    }

    const firstLevel = document.querySelector('nav#nav ul.nav-primary li.level0 a.menu-element')
      ? document.querySelectorAll('nav#nav ul.nav-primary li.level0 a.menu-element')
      : [];

    const urlArray = [];

    firstLevel.forEach((element, index) => {
      addObjectToDom(element.innerText, element.getAttribute('href'));
      urlArray.push(element.getAttribute('href'));
      const secondLevel = element.parentNode.querySelector(`#menu-${index} .sub-menu ul.level1 li a.icon`)
        ? element.parentNode.querySelectorAll(`#menu-${index} .sub-menu ul.level1 li a.icon`)
        : [];
      secondLevel.forEach((secondElement, secondIndex) => {
        addObjectToDom(element.innerText + ' > ' + secondElement.innerHTML, secondElement.getAttribute('href'));
        urlArray.push(secondElement.getAttribute('href'));
        const thirdLevel = secondElement.parentNode.querySelector('ul.level2 li a') ? secondElement.parentNode.querySelectorAll('ul.level2 li a') : [];
        thirdLevel.forEach((thirdElement) => {
          addObjectToDom(element.innerText + ' > ' + secondElement.innerHTML + ' > ' + thirdElement.innerHTML, thirdElement.getAttribute('href'));
          urlArray.push(thirdElement.getAttribute('href'));
        });
      });
    });

    const fetchObjects = fetchUrl('https://www.easyparapharmacie.com/sitemaps/www.easyparapharmacie.com/category.xml');
    fetchObjects.then((text) => {
      const div = document.createElement('div');
      div.id = 'additionUrls';
      div.innerHTML = text;
      document.querySelector('body').appendChild(div);
    });
  });
  await context.waitForSelector('#additionUrls');

  await context.evaluate(async function () {
    function addObjectToDom (name, url) {
      const div = document.createElement('div');
      const div2 = document.createElement('div');
      div.id = 'category';
      div2.id = 'categoryUrl';
      div.innerHTML = name;
      div2.innerHTML = url;
      document.querySelector('body').appendChild(div);
      document.querySelector('body').appendChild(div2);
    }

    function capitalize (str) {
      if (typeof str !== 'string') return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getUrlAndCategory (url) {
      const urlObject = {};
      urlObject.url = url;
      const tempArray = url.split('/');
      tempArray.splice(0, 3);
      let breadcrumbs = '';
      tempArray.forEach((item, i) => {
        if (i === tempArray.length - 1) {
          breadcrumbs = breadcrumbs + `${capitalize(item.replace('.html', '').replace(/-/g, ' '))}`;
        } else {
          breadcrumbs = breadcrumbs + `${capitalize(item.replace(/-/g, ' '))} > `;
        }
      });
      urlObject.breadcrumbs = breadcrumbs;
      return urlObject;
    }

    const doc = document.querySelector('#additionUrls') ? document.querySelector('#additionUrls') : '';

    if (doc) {
      const urls = doc.querySelector('urlset url loc') ? doc.querySelectorAll('urlset url loc') : [];
      const arrayOfUrlsNodes = document.querySelector('#categoryUrl') ? document.querySelectorAll('#categoryUrl') : [];

      const arrayOfUrls = [];

      arrayOfUrlsNodes.forEach((node) => {
        arrayOfUrls.push(node.innerText);
      });

      console.log(arrayOfUrls);

      urls.forEach((url) => {
        if (!arrayOfUrls.includes(url.innerText)) {
          const tempObj = getUrlAndCategory(url.innerText);
          addObjectToDom(tempObj.breadcrumbs, tempObj.url);
        }
      });
    }
  });

  await context.extract(productMenu);
}

module.exports = {
  implements: 'tracker/categories/extract',
  parameterValues: {
    country: 'FR',
    domain: 'easyparapharmacie.com',
    store: 'easyparapharmacie',
    zipcode: '',
  },
  dependencies: {
    productMenu: 'extraction:tracker/categories/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
