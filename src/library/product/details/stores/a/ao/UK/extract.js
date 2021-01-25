const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    transform,
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

    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        let documentScrollHeight = document.body.scrollHeight;
        while (scrollTop < documentScrollHeight) {
          await stall(2000);
          scrollTop += 500;
          window.scroll(0, scrollTop);
          documentScrollHeight = document.body.scrollHeight;
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };

    await applyScroll(context);
    async function scrollToRec(node) {
      await context.evaluate(async (node) => {
        const element = document.querySelector(node) || null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }, node);
    }
    await scrollToRec('section.productHelp');
    try {
      await context.waitForSelector('section.richContent article', { timeout: 15000 });
    } catch (error) {
      console.log('Not loading enhanced content');
    }

    try {
      await context.waitForSelector('div.dy-recommendations__slider', { timeout: 15000 });
    } catch (error) {
      console.log('Not loading recommended products');
    }

    try {
      await context.waitForSelector('section.alternative-products', { timeout: 15000 });
    } catch (error) {
      console.log('Not loading alternative products');
    }

    try {
      await context.evaluate(async function () {
        function addElementToDocument(key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
        function addDivClass(divClass, content) {
          const newDiv = document.createElement('div');
          newDiv.className = divClass;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const productUrl = window.location.href;
        addElementToDocument('product_url', productUrl);
        const availText = document.evaluate("//span[contains(@class,'inStockText')]", document, null, XPathResult.STRING_TYPE, null);
        if (availText && availText.stringValue) {
          if (availText.stringValue === 'Unavailable') {
            addElementToDocument('inStockText', 'Out of Stock');
          } else {
            addElementToDocument('inStockText', 'In Stock');
          }
        } else {
          addElementToDocument('inStockText', 'Out of Stock');
        }

        const rating = document.evaluate("//span[@itemprop='ratingValue']", document, null, XPathResult.STRING_TYPE, null);
        if (rating && rating.stringValue) {
          const formattedRating = rating.stringValue.replace(',', '.');
          addElementToDocument('rating2', formattedRating);
        }

        // @ts-ignore
        const brand = window.digitalData.page.product.brand;
        if (brand) {
          addElementToDocument('brand', brand);
        }

        const isVisible = (element) => document.querySelector(element) ? !!(document.querySelector(element).offsetWidth || document.querySelector(element).offsetHeight) : false;
        if (isVisible('section.alternative-products')) {
          const alternativeProducts = document.querySelectorAll('section.alternative-products span[data-tag-name^="title"]');
          [...alternativeProducts].forEach((element) => {
            if (element) {
              addDivClass('ii_AltProducts', element.innerText);
            }
          });
        }

        const manufacturer = window && window._nRepData && window._nRepData.context ? window._nRepData.context.manufacturer.replace('&#39;', '\'').replace(/\s/, ' ') : '';
        addElementToDocument('manufacturer', manufacturer);
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
            if (bulletInfo[n]) {
              bulletInfoText = bulletInfoText + '||' + bulletInfo[n].innerText;
            }
          }
          addElementToDocument('bulletInfoText', bulletInfoText);
        }

        var initImg = '';
        var initImgAlt = '';
        var initImgNode = document.querySelector('ul[data-testid="c-carousel"] li#carousel-centre-image img');
        // @ts-ignore
        if (initImgNode && initImgNode.src) {
          // @ts-ignore
          initImg = initImgNode.src.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://');
          // @ts-ignore
          initImgAlt = initImgNode.alt;
        } else if (document.querySelector('ul.product-gallery__thumbnail-items li#thumbnailItem[data-media-type="hero"] img')) {
          // @ts-ignore
          initImg = document.querySelector('ul.product-gallery__thumbnail-items li#thumbnailItem[data-media-type="hero"] img').src.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://');
          // @ts-ignore
          initImgAlt = document.querySelector('ul.product-gallery__thumbnail-items li#thumbnailItem[data-media-type="hero"] img').alt;
        }
        addElementToDocument('initImg', initImg);
        addElementToDocument('initImgAlt', initImgAlt);

        function timeout(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        var imageArr = [];
        var rightArrow = document.querySelector('div#mediaGalleryNext');
        var flag = 0;
        if(rightArrow) {
          flag = 1;
        }
        console.log('entering the while loop!!');
        while (flag) {
          if (rightArrow) {
            rightArrow.click();
            await timeout(2000);
            var imageUrl = document.evaluate('//li[@id="carousel-right-image"][contains(@data-media-type,"image")]//img/@src', document, null, XPathResult.ANY_TYPE, null).iterateNext() && document.evaluate('//li[@id="carousel-right-image"][contains(@data-media-type,"image")]//img/@src', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent;
            console.log('imageUrl', imageUrl);
            if (imageUrl !== null) {
              if (imageArr.indexOf(imageUrl) === -1) {
                imageArr.push(imageUrl);
              } else {
                break;
              }
            }
          }
        }

        var getRatingDiv = document.querySelectorAll('#reviews-content-current > div');
        if (getRatingDiv.length) {
          getRatingDiv.forEach(e => {
            if (e.clientHeight) {
              var rating = e.querySelector('span.avgRating.text-title-lg span') && e.querySelector('span.avgRating.text-title-lg span').textContent;
              if (rating) {
                document.querySelector('h1').setAttribute('rating', rating);
              }
            }
          });
        }


        var checkThumbnail = document.querySelector('ul.product-gallery__thumbnail-items');
        if (!checkThumbnail) {
          console.log('removed', imageArr.pop());
        } else {
          console.log('final Array', imageArr);
        }


        for (let i = 0; i < imageArr.length; i++) {
          addDivClass('altImages', imageArr[i]);
        }



        const jsonScript = !!document.querySelector('script[id="mediaData"]');
        if (jsonScript && document.querySelector('script[id="mediaData"]')) {
          const jsonInfo = JSON.parse(document.querySelector('script[id="mediaData"]').innerText);
          const vidArr = jsonInfo.videos || [];
          for (let i = 0; i < vidArr.length; i++) {
            addDivClass('galleryVideos', vidArr[i].playerUrl);
          }
        } else {
          var chkCond = '';
          if (initImg && document.getElementById('mediaGalleryNext')) {
            do {
              var nextButt = document.getElementById('mediaGalleryNext');
              await new Promise((resolve, reject) => setTimeout(resolve, 4000));
              if (nextButt) {
                nextButt.click();
                var currImg = document.evaluate("//li[@id='carousel-right-image' and @data-media-type='image']//img/@src", document, null, XPathResult.STRING_TYPE, null);
              }
              if (currImg && currImg.stringValue.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://') !== initImg) {
                addDivClass('altImages', currImg.stringValue.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://'));
              }
              chkCond = currImg.stringValue.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://').replace(/ /g, '%20') ? currImg.stringValue.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://').replace(/ /g, '%20') : initImg;
            }
            while (chkCond !== initImg);
          }
        }
        const specs = document.querySelectorAll('section.productSpecification div.accordionItem span');
        if (specs) {
          var specsText = '';
          for (var t = 1; t < specs.length - 1; t++) {
            // @ts-ignore
            if (specs[t]) {
              specsText = specsText + ' ' + specs[t].innerText;
            }
          }
          addDivClass('specificationtext', specsText);
        }
        const category = document.querySelectorAll('ul#breadcrumb li');
        if (category) {
          var categoryText = '';
          // start point 1 is correct this is to skip first category which is startseite
          for (var q = 1; q < category.length - 1; q++) {
            // @ts-ignore
            if (category[q]) {
              categoryText = category[q].innerText;
              addDivClass('category', categoryText);
            }
          }
        }
        const nodeListH = document.querySelectorAll('section.richContent h3');
        var allEnhancedContent = '';
        if (nodeListH && nodeListH.length > 0) {
          for (var k = 0; k < nodeListH.length; k++) {
            // @ts-ignore
            if (nodeListH[k]) {
              allEnhancedContent = allEnhancedContent + ' ' + nodeListH[k].innerText + ' ' + (nodeListH[k].nextElementSibling ? nodeListH[k].nextElementSibling.innerText : '');
            }
          }
          const allEnhancedContentHeader = document.querySelector('section.richContent h2');
          if (allEnhancedContentHeader) {
            allEnhancedContent = allEnhancedContentHeader.textContent + ' ' + allEnhancedContent;
          }
          addElementToDocument('enhCont', allEnhancedContent);
        }
      });
    } catch (err) {
      console.log('Error while fetching enhanced content' + JSON.stringify(err));
    }

    try {
      await context.evaluate(async function getDataFromAPI(id) {
        function addHiddenDiv(vidurl, content) {
          const newDiv = document.createElement('div');
          newDiv.setAttribute('data-vidurl', vidurl);
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        var vidDiv = document.querySelectorAll('*[data-video]');
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
            var video = videoApi ? videoApi.sources[1].src : '';
            addHiddenDiv('vidURL', video);
          }
        }
      });
    } catch (err) {
      console.log('Error while fetching videos' + JSON.stringify(err));
    }

    await context.extract(productDetails, { transform });
  },
};
