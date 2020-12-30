const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    transform,
    domain: 'citilink.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    const url = await context.evaluate(async function () {
      return window.location.href;
    });
    await context.goto(url + '/properties', { waitUntil: 'networkidle0' });
    await context.waitForNavigation();
    await context.evaluate(async function () {
      const specs = document.evaluate("//div[@class = 'Specifications__row']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      let specifications = '';
      for (let i = 0; i < specs.snapshotLength; i++) {
        specifications += specs.snapshotItem(i).children[0].innerText + ' : ' + specs.snapshotItem(i).children[1].innerText + ' | ';
      }
      sessionStorage.setItem('Specifications', specifications.replace('\"' , '').slice(0 , -2));
    });
    await context.goto(url, { waitUntil: 'networkidle0' });
    await context.waitForNavigation();
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };
      addHiddenDiv('import_availability_text', window.dataLayer[0].productAvailability);
      addHiddenDiv('import_product_weight', window.dataLayer[0].additions.properties.Вес);
      addHiddenDiv('import_product_warranty', window.dataLayer[0].additions.properties.Гарантия);
      addHiddenDiv('import_product_specs', window.sessionStorage.Specifications);
      addHiddenDiv('import_list_price', parseInt(window.dataLayer[0].productClubPrice));
    });
    await context.evaluate(async () => {

    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    let desList;
    let desc = document.querySelectorAll('div.AboutTab__description-text > *');
    if(desc) {
      desc.forEach((element) => {
        desList += element.textContent;

      });
      addHiddenDiv('desList', desList);

    } 
    // let categoryList = [];
    // let cate = document.querySelectorAll('div.Breadcrumbs')
    // if(cate) {
    //   cate.forEach((element) => {
    //     categoryList.push(element.innerText);

    //   });
    //   console.log(categoryList , 'categoryList');
    //   addHiddenDiv('categoryList', categoryList);

    // } 
    let name = document.querySelector('h1.Heading.Heading_level_1.ProductHeader__title')
    let proName;
    if(name) {
      proName= name.innerText
      console.log(proName , 'ssss');
    } 
    addHiddenDiv('name', proName);
    let images = document.querySelectorAll('div.Breadcrumbs');
    console.log(images, 'ss');
    const category = images ? images.length : null;
    if (category) {
      images.forEach((element) => {
        const categoryLink = document.createElement('div');
        categoryLink.setAttribute('class', 'category');
        categoryLink.setAttribute('href', element.innerText);
        document.body.appendChild(categoryLink);
      });
      // const secondaryImageCount = document.createElement('div');
      // secondaryImageCount.setAttribute('class', 'alternateImagesCountTotal');
      // // @ts-ignore
      // secondaryImageCount.setAttribute('sum', alternateImagesCount);
      // document.body.appendChild(secondaryImageCount);
    }
    // addHiddenDiv('alternateImagesCount', alternateImagesCount);

  });

    return await context.extract(data, { transform });
  },
  
};
