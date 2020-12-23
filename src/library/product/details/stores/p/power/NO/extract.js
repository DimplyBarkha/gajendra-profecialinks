const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'power',
    transform: cleanUp,
    domain: 'power.no',
    zipcode: '',
  },

  implementation: async (inputString, { country, domain, transform }, context, { productDetails }) => {
    const { id } = inputString;
    if (id) {
      await context.waitForSelector('a.product__link');
      try {
        await context.click('#declineButton');
      } catch (error) {
        console.log('Popup not present');
      }
      await context.waitForSelector('div.product-image-picture');
      await context.click('a.product__link');
    }

    await context.waitForSelector('#product-information-tabs > div:nth-child(1) > div > i');
    await context.waitForSelector('#product-intro pwr-product-stock-label');
    await context.click('#product-information-tabs > div:nth-child(1) > div > i');
    await new Promise((resolve, reject) => setTimeout(resolve, 8000));

    try {
      await context.waitForSelector('pwr-product-specifications > div');
    } catch (err) {
      console.log(err);
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function getElementByXpath (path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      function timeout (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      const nameExtendedSelector1 = document.querySelector('#header-page h1');
      const nameExtendedSelector2 = document.querySelector('.webheader');

      const nameExtended = [];
      if (nameExtendedSelector1) {
        nameExtended.push(nameExtendedSelector1.innerText);
      }
      if (nameExtendedSelector2) {
        nameExtended.push(nameExtendedSelector2.innerText);
      }
      addElementToDocument('fetchedNameExtended', nameExtended.join(' ').replace('"', ' '));

      let images = document.querySelectorAll('div.inpage_block img');
      if (images) {
        images.forEach(e => {
          let imageSrc = e.getAttribute('srcset');
          if (imageSrc) {
            if (!(imageSrc.includes('https:'))) {
              imageSrc = `https:${imageSrc}`;
            }
            if ((imageSrc.includes('video_thumb_play'))) {
              imageSrc = '';
            }
          }
          addElementToDocument('manuImages', imageSrc);
        });
      } else if (document.querySelectorAll('div#product-tab-description div div.image-wrapper img')) {
        images = document.querySelectorAll('div#product-tab-description div div.image-wrapper img');
        images.forEach(e => {
          let imageSrc = e.getAttribute('src');
          if (imageSrc) {
            if (!(imageSrc.includes('https:'))) {
              imageSrc = `https:${imageSrc}`;
            }
            if ((imageSrc.includes('video_thumb_play'))) {
              imageSrc = '';
            }
          }
          addElementToDocument('manuImages', imageSrc);
        });
      } else {
        images = document.querySelectorAll('div#product-tab-description-panel img');
        if (images) {
          images.forEach(e => {
            let imageSrc = e.getAttribute('srcset');
            if (imageSrc) {
              if (!(imageSrc.includes('https:'))) {
                imageSrc = `https:${imageSrc}`;
              }
              if ((imageSrc.includes('video_thumb_play'))) {
                imageSrc = '';
              }
            }
            addElementToDocument('manuImages', imageSrc);
          });
        }
      }

      const price = document.querySelector('meta[property="product:price:amount"]')
        ? document.querySelector('meta[property="product:price:amount"]').getAttribute('content') : '';
      const currency = document.querySelector('meta[property="product:price:currency"]')
        ? document.querySelector('meta[property="product:price:currency"]').getAttribute('content') : '';
      if (price) {
        const fullPrice = `${parseInt(price).toFixed(2)} ${currency}`;
        addElementToDocument('fullPrice', fullPrice);
      }

      const imageAlt = document.querySelector('div.product-image-container img') ? document.querySelector('div.product-image-container img').getAttribute('alt') : '';
      if (imageAlt) addElementToDocument('imageAlt', imageAlt);

      const brand = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Produsent")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Produsent")]/following-sibling::div').textContent
        : getElementByXpath("//div[contains(@class, 'brand-logo')]//img/@alt") ? getElementByXpath("//div[contains(@class, 'brand-logo')]//img").alt : '';
      if (brand) addElementToDocument('brand', brand);

      const eangtin = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"EAN")]/following-sibling::div')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"EAN")]/following-sibling::div').textContent
        : '';
      if (eangtin) addElementToDocument('eangtin', eangtin);

      let stock = getElementByXpath('//*[@id="product-intro"]//pwr-product-stock-label[1]/span/@class')
        ? getElementByXpath('//*[@id="product-intro"]//pwr-product-stock-label[1]/span/@class').textContent
        : '';

      if (stock) {
        if (stock.includes('stock-available')) {
          stock = 'In Stock';
        } else {
          stock = 'Out of Stock';
        }
        addElementToDocument('stock', stock);
      } else {
        stock = 'Out of Stock';
        addElementToDocument('stock', stock);
      }

      const color = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"farge")]/following-sibling::*')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"farge")]/following-sibling::*').textContent
        : '';
      if (color) addElementToDocument('color', color);

      const weightNet = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Nettovekt")]/following-sibling::*')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Nettovekt")]/following-sibling::*').textContent
        : '';
      if (weightNet) addElementToDocument('weightNet', weightNet);

      const weightGross = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttovekt")]/following-sibling::*')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttovekt")]/following-sibling::*').textContent
        : '';
      if (weightGross) addElementToDocument('weightGross', weightGross);

      const dimensions = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttomål med")]/following-sibling::*')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Bruttomål med")]/following-sibling::*').textContent
        : '';
      if (dimensions) addElementToDocument('dimensions', dimensions);

      const mpc = getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Leverandørens")]/following-sibling::*')
        ? getElementByXpath('//div[@class="row ng-star-inserted"]/div[contains(text(),"Leverandørens")]/following-sibling::*').textContent
        : '';
      if (mpc) addElementToDocument('mpc', mpc);

      const warranty = getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "garanti")]')
        ? getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "garanti")]').textContent
        : '';
      if (warranty) addElementToDocument('warranty', warranty);

      const storage = getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "oppbevaring")]')
        ? getElementByXpath('//*[@id="product-intro"]//*[contains(text(), "oppbevaring")]').textContent
        : '';
      if (storage) addElementToDocument('storage', storage);

      const shipingInfo = getElementByXpath('//*[@id="product-intro"]//div[@class="pickup-from-store"]')
        ? getElementByXpath('//*[@id="product-intro"]//div[@class="pickup-from-store"]').textContent
        : '';
      if (shipingInfo) addElementToDocument('shipingInfo', shipingInfo);

      const description = document.querySelectorAll('div#product-tab-description p');
      const descTitle = document.querySelector('h3[class*=webheader]');
      const descArr = [];
      if (descTitle) {
        descArr.push(descTitle.innerText);
      }
      if (description) {
        description.forEach(e => {
          descArr.push(e.innerText.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));
        });
      }
      addElementToDocument('description', descArr.join(' || '));

      const manufacturerDesc = document.querySelector('div#product-tab-description')
        ? document.querySelector('div#product-tab-description').innerText : '';
      if (manufacturerDesc) {
        addElementToDocument('manufacturerDesc', manufacturerDesc.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));
      };

      const specifications = document.querySelectorAll('pwr-product-specifications > div');
      const specArr = [];
      if (specifications) {
        specifications.forEach(e => {
          specArr.push(e.innerText.replace(/\n{2,}/g, '').replace(/\s{2,}/g, ' '));
        });
      }
      addElementToDocument('specifications', specArr.join(' || '));

      const bulletInfo = document.querySelectorAll('div.product-intro-details ul.product-description-bullets li');
      const descBulletInfo = [];
      if (bulletInfo) {
        bulletInfo.forEach(e => {
          const childEl = e.querySelector('a');

          if (!childEl) {
            descBulletInfo.push(e.innerText);
          }

        });
      }
      addElementToDocument('descBulletInfo', descBulletInfo.join(' || '));
      const sku = document.querySelector(`meta[itemprop='sku']`) ? document.querySelector(`meta[itemprop='sku']`).content : null;
      const productName = document.querySelector('.old-product-page h1') ? document.querySelector('.old-product-page h1').innerText : null;

      if (sku && productName) {
        const url = `https://dapi.videoly.co/1/videos/0/394?SKU=${sku}&productId=${sku}&productTitle=${productName}&hn=www.power.no`;
        const response = await fetch(url);

        if (response.ok) {
          const json = await response.json();

          for (const item of json.items) {
            const videoId = item.videoId;
            const newEl = document.createElement('import-video');
            newEl.setAttribute('data', `https://www.youtube.com/watch?v=${videoId}`);
            document.body.appendChild(newEl);
          }
        }
      }

      const imageEl =document.evaluate(`//div[@id='product-image-carousel']//div[contains(@class, 'owl-item')][1]//source[last()]/@srcset`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      if (imageEl) {
        let productImageUrl = imageEl.textContent;
        productImageUrl = productImageUrl.split(', ');
        productImageUrl = productImageUrl[productImageUrl.length - 1].split(' ')[0];
        document.body.setAttribute('import-primary-image', productImageUrl)
      }

      const cookies = document.querySelector('button#cookie-notification-accept');
      if (cookies) {
        cookies.click();
        await timeout(2000);
      }
      const aggRating = document.querySelector('div.product-intro-details button[itemprop="ratingValue"]')
        ? document.querySelector('div.product-intro-details button[itemprop="ratingValue"]').innerText : '';
      if (aggRating) addElementToDocument('aggRating', aggRating);
    });
    await context.evaluate(async function () {
      const mainTabsSelector = document.querySelectorAll('h3.panel-title');
      if (mainTabsSelector) {
        mainTabsSelector.forEach(ele => {
          if (ele.innerText.includes('Spesifikasjoner')) {
            ele.click();
          }
        });
      }
    });
    await context.evaluate(async function () {
      let scrollSelector = document.querySelector('footer[id="footer-site"]');
      let scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
      let yPos = 0;
      while (scrollLimit && yPos < scrollLimit) {
        yPos = yPos + 350;
        window.scrollTo(0, yPos);
        scrollSelector = document.querySelector('footer[id="footer-site"]');
        scrollLimit = scrollSelector ? scrollSelector.offsetTop : '';
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    });
    try {
      await context.waitForSelector('div.product-main-card div.product-image-container img');
    } catch (error) {
      console.log('All images not loaded after scrolling!!');
    }

    await context.extract(productDetails, { transform });
  },
};
