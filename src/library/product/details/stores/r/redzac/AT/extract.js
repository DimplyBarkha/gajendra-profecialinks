const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'redzac',
    transform,
    domain: 'redzac.at',
    zipcode: '',
  },

  implementation: async (inputs, { country, domain, transform }, context, dependencies) => {
    // await context.waitForSelector(
    //   '#product_detail_image_wrapper__details_image_container > picture > source:nth-child(1)',
    // );
    // await context.waitForSelector(
    //   '#dyson_jump_features div.inpage_ftgridtext, .inpage_selector_header',
    // );
    await context.waitForSelector(
      '.mlayout_page_wrapper',
    );
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // adding image to DOM
      let image = '';
      if (
        document.querySelector(
          '#product_detail_image_wrapper__details_image_container > picture > source:nth-child(1)',
        )
      ) {
        image = document.querySelector(
          '#product_detail_image_wrapper__details_image_container > picture > source:nth-child(1)',
        ).srcset;
        const end = image.lastIndexOf(' ');
        const beginning = image.substr(0, end).lastIndexOf(' ');
        image = `https://www.redzac.at${image.substring(
                    beginning + 1,
                    end,
                )}`;
      }
      if (image) addElementToDocument('image', image);

      // adding specifications to DOM
      const dataCell = document.querySelectorAll('td.data_cell') ? document.querySelectorAll('td.data_cell') : '';
      let specifications = '';
      if (dataCell) {
        dataCell.forEach((elem, index, data) => {
          if (elem.innerText === 'Breite (cm)' || elem.innerText === 'Höhe (cm)' || elem.innerText === 'Tiefe (cm)') {
            specifications += `${elem.innerHTML} ${data[index + 1].innerHTML}`;
          }
        });
      }
      if (specifications) addElementToDocument('specifications', specifications);

      // adding manufacturerImages to the DOM

      // const manufacturerImgs = document.querySelectorAll(
      //   '#dyson_jump_features  div.inpage_ftgridimg',
      // )
      //   ? document.querySelectorAll(
      //     '#dyson_jump_features  div.inpage_ftgridimg img',
      //   )
      //   : '';
      // manufacturerImages = [];
      // manufacturerImgs.forEach(img => { manufacturerImages.push('https:' + img.srcset); });
      // if (manufacturerImages) addElementToDocument('manufacturerImages', manufacturerImages.toString());

      const manufacturerImages = document.querySelector('#inpage_container div.dyson_visual img') ? `https:${document.querySelector('#inpage_container div.dyson_visual img').srcset}` : '';
      if (manufacturerImages !== 'https:') addElementToDocument('manufacturerImages', manufacturerImages);
      // adding sub_category
      let subCategoryAll = document.querySelectorAll('#page_transition_container  .mlayout_breadcrumb a') ? [...document.querySelectorAll('#page_transition_container  .mlayout_breadcrumb a')] : '';
      subCategoryAll = subCategoryAll.splice(2, subCategoryAll.length);
      const a = [];
      subCategoryAll.forEach(elem => { a.push(elem.innerText); });
      const sub_category = a.join('>');
      if (sub_category) addElementToDocument('sub_category', sub_category);

      let nameExtended = '';
      if (document.querySelector('#objectView_page .product_name') && document.querySelector('[data-flix-brand]')) {
        nameExtended = `${document.querySelector('[data-flix-brand]').dataset.flixBrand} - ${document.querySelector('#objectView_page .product_name').innerText}`;
      };
      if (nameExtended) addElementToDocument('nameExtended', nameExtended);

      // adding listPrice
      const listPrice = document.querySelector('.product_price_saving') ? document.getElementById('block$price$product').querySelector('span').innerText : '';
      if (listPrice) addElementToDocument('listPrice', listPrice);

      // adding additionalDescBulletInfo
      const bullets = document.querySelectorAll('#objectView_page .product_main_facts li') ? document.querySelectorAll('#objectView_page .product_main_facts li') : '';
      const bulletsArr = [];
      if (bullets) { bullets.forEach(bullet => bulletsArr.push(bullet.innerText)); }
      additionalDescBulletInfo = '';
      bulletsArr.forEach(elem => { additionalDescBulletInfo += (`|| ${elem}`); });
      if (additionalDescBulletInfo) addElementToDocument('additionalDescBulletInfo', additionalDescBulletInfo);

      // adding description
      let description = document.querySelector('#ci_description1_content') ? document.querySelector('#ci_description1_content').innerText : '';
      if (description) {
        if (additionalDescBulletInfo) { description = `${additionalDescBulletInfo} || ${description}`; }
      } else {
        description = additionalDescBulletInfo;
      }
      if (description) addElementToDocument('description', description);

      // adding manufacturerDescription
      const manufacturerDescriptionArr = document.querySelectorAll('#dyson_jump_features div.inpage_ftgridtext') ? [...document.querySelectorAll('#dyson_jump_features div.inpage_ftgridtext')] : '';
      if (manufacturerDescriptionArr) {
        manufacturerDescriptionArr.forEach((elem, index, arr) => {
          arr[index] = elem.innerText;
        });
      }
      const manufacturerDescription = manufacturerDescriptionArr.join(' ');
      if (manufacturerDescription) addElementToDocument('manufacturerDescription', manufacturerDescription);

      // adding energyEfficiency
      const energySelector = document.querySelectorAll('div.description_text_enumeration > ul > li');
      const energyRegex = /Energieeffizienzklasse:\s([A-z+]+)/;
      for (let x = 0; energySelector.length > x; x++) {
        const found = energySelector[x].innerText.match(energyRegex);
        if (found) {
          addElementToDocument('energyefficiency', found[1]);
        }
      }

      // Modyfing ratingValue
      await new Promise(resolve => setTimeout(resolve, 1000));
      const ratingValueSelector = document.querySelector('span.bv-rating > span');
      console.log(ratingValueSelector);
      if (ratingValueSelector) {
        const newRating = ratingValueSelector.textContent.replace(/\./, ',');
        addElementToDocument('properrating', newRating);
      }
    });

    //production fixes
    try{
      await context.evaluate(()=>{
        document.querySelector('.mlayout_footer').scrollIntoView({ behavior:"smooth" });
      })
      await context.waitForSelector('#flix-inpage img');
    }catch(err){
      console.log('No enhanced content');
    }
    try{
      await context.waitForSelector('.flix-video-feat img');
    }catch(err){
      console.log('No video in enhanced content');
    }
    await context.evaluate(()=>{
      //@ts-ignore
      let carousel = [...document.querySelectorAll('div[id*=carouselcatalog] li img')];
      let videoLinks=[];
      for(let i=0;i<carousel.length;i++)
      if(carousel[i].getAttribute('src').search('youtube') != -1){
        videoLinks.push(carousel[i].getAttribute('src'));
      }
      //@ts-ignore
      videoLinks = [...new Set(videoLinks)];
      let videoCodes=[];
      for(let i=0;i<videoLinks.length;i++){
        videoLinks[i] = videoLinks[i].match(/vi\/(.+)\//g);
        videoCodes.push(videoLinks[i][0].split('/')[1])
      }
      //@ts-ignore
      videoCodes = [...new Set(videoCodes)];
      let videoSrc=[]
      for(let i=0;i<videoCodes.length;i++){
        videoSrc[i]='https://www.youtube.com/watch?v='+videoCodes[i]
      }
      let videoAppend = videoSrc.join(' | ');
      document.querySelector('body').setAttribute('video-src', videoAppend)
    })
    await context.evaluate(async function() {
      console.log('secondary image clicking');
      let secondaryImageButton = document.querySelector('.resp-sl-hide.resp-sp-hide.resp-tl-hide.resp-tp-hide .jcarousel-list.jcarousel-list-horizontal li');
      if(secondaryImageButton){
        secondaryImageButton.click();
        console.log('secondary image clicked')
      }
    });
    // function addHiddenDiv (id, content) {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = id;
    //   newDiv.textContent = content;
    //   newDiv.style.display = 'none';
    //   document.body.appendChild(newDiv);
    //   }
    //   let secondaryImage = document.evaluate(`//div[contains(@class,"jcarousel-clip jcarousel-clip-horizontal all_items_visible")]//ul[contains(@class,'jcarousel-list jcarousel-list-horizontal')]/li[@class="jcarousel-item"]//img/@src`,document).iterateNext().textContent
    //   console.log(secondaryImage);
    //   addHiddenDiv('alternateImages',secondaryImage);
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
