const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    transform: cleanUp,
    domain: 'ao.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const accCookie = document.querySelector('button.ao-cb__button.ao-cb__button--accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
    });
    await context.evaluate(async function () {
      const promoClose = document.querySelector('button.promotionModalClose.icon-close.c-modal-close.u-pos--absolute.ico.ico-close.ico-lg');
      if (promoClose) {
        // @ts-ignore
        promoClose.click();
      }
    });
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addDivClass (divClass, content) {
        const newDiv = document.createElement('div');
        newDiv.className = divClass;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const availText = document.evaluate("//span[contains(@class,'inStockText')]", document, null, XPathResult.STRING_TYPE, null);
      if (availText && availText.stringValue) {
        addElementToDocument('inStockText', 'In Stock');
      } else {
        addElementToDocument('inStockText', 'Out of Stock');
      }
      const manufacturer = document.evaluate("//script[contains(text(), 'manufacturer')]", document, null, XPathResult.STRING_TYPE, null);
      if (manufacturer && manufacturer.stringValue) {
        // @ts-ignore
        var manufText = /manufacturer":[\s"]+([A-z]+)/.exec(manufacturer.stringValue);
        addElementToDocument('manufacturer', manufText[1]);
      }
      const img360 = document.evaluate("//div[contains(@class,'product-gallery__button cta cta-secondary icon-three-sixty')]", document, null, XPathResult.STRING_TYPE, null);
      if (img360 && img360.stringValue) {
        addElementToDocument('img360', 'Yes');
      } else {
        addElementToDocument('img360', 'No');
      }
      const bulletInfo = document.querySelectorAll('div.topRight ul.featureBullets li');
      if (bulletInfo) {
        var bulletInfoText = '';
        for (var n = 0; n < bulletInfo.length; n++) {
          // @ts-ignore
          bulletInfoText = bulletInfoText + '||' + bulletInfo[n].innerText;
        }
        addElementToDocument('bulletInfoText', bulletInfoText);
      }
      const specs = document.querySelectorAll('section.productSpecification div.accordionItem span');
      if (specs) {
        var specsText ='';
        for (var t = 1; t < specs.length - 1; t++) {
          // @ts-ignore
          specsText = specsText + ' ' + specs[t].innerText;
        }
        addDivClass('specificationtext', specsText);
      }
      const category = document.querySelectorAll('ul#breadcrumb li');
      if (category) {
        var categoryText = '';
        // start point 1 is correct this is to skip first category which is startseite
        for (var q = 1; q < category.length - 1; q++) {
          // @ts-ignore
          categoryText = category[q].innerText;
          addDivClass('category', categoryText);
        }
      }
      // @ts-ignore
      const brand = window.digitalData.page.product.brand;
      if (brand) {
        addElementToDocument('brand', brand);
      }
      const nodeListH = document.querySelectorAll('section.richContent h3');
      var allEnhancedContent = '';
      if (nodeListH && nodeListH.length > 0) {
        for (var k = 0; k < nodeListH.length; k++) {
          // @ts-ignore
          allEnhancedContent = allEnhancedContent + ' ' + nodeListH[k].innerText + ' ' + nodeListH[k].nextElementSibling.innerText;
        }
        addElementToDocument('enhCont', allEnhancedContent);
      }
      const rating = document.evaluate("//div[@itemprop='aggregateRating']/meta[@itemprop='ratingValue']/@content", document, null, XPathResult.STRING_TYPE, null);
      if (rating && rating.stringValue) {
        const formattedRating = rating.stringValue.replace(',', '.');
        addElementToDocument('rating', formattedRating);
      }
    });
    await context.evaluate(async function getDataFromAPI (id) {
      function addHiddenDiv (vidurl, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('data-vidurl', vidurl);
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      var vidDiv = document.querySelectorAll('div[data-video]');
      if (vidDiv && vidDiv.length > 0) {
        for (var p = 0; p < vidDiv.length; p++) {
          var dataVideoId = vidDiv[p].getAttribute('data-video');
          var vidApiUrl = `https://edge.api.brightcove.com/playback/v1/accounts/710857100001/videos/${dataVideoId}`;
          var videoApi = await fetch(vidApiUrl,
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json;pk=BCpkADawqM3B5XJU7SGL-maMkrIayLomRW5lLNXIfLy36qPr3WrV4vETM_zo7fI59Y0CGeJV8TnfqKDnIYxfGmIbhIgBofws62TmP-EJeb_cPkundrsgauDdAeM',
              },
              method: 'GET',
            },
          ).then(x => x.json());
          var video = videoApi.sources[1].src;
          addHiddenDiv('vidURL', video);
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
