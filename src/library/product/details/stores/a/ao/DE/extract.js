const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'ao',
    transform,
    domain: 'ao.de',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const accCookie = document.querySelector('button.ao-cb__button.ao-cb__button--accept');
      if (accCookie) {
        // @ts-ignore
        accCookie.click();
      }
    });
    await context.evaluate(async () => {
      const promoClose = document.querySelector('button.promotionModalClose.icon-close.c-modal-close.u-pos--absolute.ico.ico-close.ico-lg');
      if (promoClose) {
        // @ts-ignore
        promoClose.click();
      }
    });

    try {
      await context.waitForSelector('section.richContent article', { timeout: 45000 });
    } catch (error) {
      console.log('Not loading enhanced content');
    }

    async function scrollToRec (node) {
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

    await scrollToRec('section.richContent article');

    try {
      await context.evaluate(async () => {
        function addDivClass (divClass, content) {
          const newDiv = document.createElement('div');
          newDiv.className = divClass;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        const addElementToDocument = (key, value) => {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        };

        const brand = window.digitalData.page.product.brand;
        if (brand) {
          addElementToDocument('brand', brand);
        }

        const productObj = window.digitalData.page.product;
        const reviewsString = productObj.reviewsInfo !== '0|0' ? productObj.reviewsInfo : '';
        const ratingCount = reviewsString.match(/(.+)\|(\d+)/) ? reviewsString.match(/(.+)\|(\d+)/)[2] : '';
        const aggregateRating = reviewsString.match(/(.+)\|(\d+)/) ? reviewsString.match(/(.+)\|(\d+)/)[1] : '';

        addElementToDocument('product_url', window.location.href);
        addElementToDocument('availability', productObj.isInStock ? 'In stock' : 'Out of stock');
        addElementToDocument('sku', productObj.sku);
        addElementToDocument('rating_count', ratingCount);
        addElementToDocument('aggregate_rating', aggregateRating.replace('.', ','));
        addElementToDocument('customer_service_availability', document.querySelector('div#liveChatApp') ? 'Yes' : 'No');
        addElementToDocument('image_zoom_present', document.querySelector('div[data-tag-area="product zoom"] > img') ? 'Yes' : 'No');

        const extraScript = document.querySelector('script#product-json')
          ? document.querySelector('script#product-json').textContent
          : '{}';
        const extraProductObj = JSON.parse(extraScript);

        const image360Present =
          Object.keys(extraProductObj).length && extraProductObj.Gallery && extraProductObj.Gallery.threeSixty && extraProductObj.Gallery.threeSixty.enabled
            ? 'Yes'
            : 'No';
        addElementToDocument('image_360_present', image360Present);

        // Enhanced content
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

          // Using the old code to extract alternate images
          var initImg = '';
          var initImgAlt = '';
          var initImgNode = document.querySelector('ul[data-testid="c-carousel"] li#carousel-centre-image img');
          // @ts-ignore
          if (initImgNode && initImgNode.src) {
            // @ts-ignore
            initImg = initImgNode.src.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://');
            // @ts-ignore
            initImgAlt = initImgNode.alt;
          } else if(document.querySelector('ul.product-gallery__thumbnail-items li#thumbnailItem[data-media-type="hero"] img')) {
            // @ts-ignore

            initImg = document.querySelector('ul.product-gallery__thumbnail-items li#thumbnailItem[data-media-type="hero"] img').src.replace(/https:\/\//g, '//').replace(/\/\//g, 'https://');
            // @ts-ignore
            initImgAlt = document.querySelector('ul.product-gallery__thumbnail-items li#thumbnailItem[data-media-type="hero"] img').alt;
          }
          addElementToDocument('initImg', initImg);
          addElementToDocument('initImgAlt', initImgAlt);
          const jsonScript = !!document.querySelector('script[id="mediaData"]');
          if (jsonScript && document.querySelector('script[id="mediaData"]')) {
            const jsonInfo = JSON.parse(document.querySelector('script[id="mediaData"]').innerText);
            const imgArr = jsonInfo.images || [];
            for (let i = 1; i < imgArr.length; i++) {
              addDivClass('altImages', 'https:' + imgArr[i].large);
            }
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

      });
    } catch (err) {
      console.log('Error while fetching enhanced content' + JSON.stringify(err));
    }

    try {
      await context.evaluate(async function getDataFromAPI (id) {
        function addHiddenDiv (vidurl, content) {
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
