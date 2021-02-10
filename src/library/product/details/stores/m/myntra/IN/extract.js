const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    transform: cleanUp,
    domain: 'myntra.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 10000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 10000) {
            await stall(1000);
            break;
          }
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
    let idXpath = '//*[contains(text(),"Product Code:")]//*';
    let idPresent = false;
    try {
      await context.waitForXPath(idXpath);
      idPresent = true;
    } catch(err) {
      console.log('got some error while waiting for id to load', err.message);
    }

    async function scrollToRecGlobal (node) {
      await context.evaluate(async (node) => {
        let elm = document.evaluate(node, document, null, 7, null);
        let element = {};
        if(elm && elm.snapshotLength > 0) {
          element = elm.snapshotItem(0);
        } else {
          element = null;
        }
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }, node);
    }

    if(!idPresent) {
      await scrollToRecGlobal(idXpath);
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        await context.waitForXPath(idXpath);
        idPresent = true;
      } catch(err) {
        console.log('got some error while waiting for id to load', err.message);
      }
    }
    await context.evaluate(async function (idXpath, idPresent) {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const bulletInfo1 = document.querySelectorAll('p.pdp-product-description-content li');
      const bulletInfo2 = document.querySelectorAll('ul.pdp-offers-offerDesc li div.pdp-offers-labelMarkup');
      const descBulletInfo = [''];
      if (bulletInfo1) {
        bulletInfo1.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      if (bulletInfo2) {
        bulletInfo2.forEach(e => {
          descBulletInfo.push(e.innerText);
        });
      }
      addElementToDocument('desc_bullets', descBulletInfo.join(' || '));

      let gotAllDataFromScript = false;
      try {
        const data = document.querySelectorAll('script[type="application/ld+json"]');
        const json = data && data[1] && data[1].innerText ? JSON.parse(data[1].innerText) : '';
        if (json) {
          if (json.offers && json.offers.availability === 'InStock') {
            addElementToDocument('availability', 'In Stock');
          } else addElementToDocument('availability', 'Out of Stock');
          addElementToDocument('sku', json.sku);
          addElementToDocument('mpc', json.mpn);
          gotAllDataFromScript = true;
        }
      } catch(err) {
        console.log('got some error while getting data from script', err.message);
      }

      let sku = '';
      let mpc = '';
      let availability = '';
      async function scrollToRec (node) {
        let elm = document.evaluate(node, document, null, 7, null);
        let element = {};
        if(elm && elm.snapshotLength > 0) {
          element = elm.snapshotItem(0);
        } else {
          element = null;
        }
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }
      console.log('gotAllDataFromScript', gotAllDataFromScript);
      if(!gotAllDataFromScript) {
        // input url - https://www.myntra.com/8119769
        // api url - 
        await scrollToRec(idXpath);
        await new Promise(resolve => setTimeout(resolve, 2000));
        let id = '';
        console.log('idPresent', idPresent);
        if(idPresent) {
          let idElm = document.evaluate(idXpath, document, null, 7, null);
          if(idElm && idElm.snapshotLength > 0) {
            id = idElm.snapshotItem(0).textContent;
            if(id) {
              id = id.trim();
            }
          }

          let resp = {};
          let jsonResp = {};
          let gotRespOk = false;
          if(id) {
            try {
              resp = await fetch(`https://www.myntra.com/gateway/v2/product/${id}`);
              jsonResp = await resp.json();
              gotRespOk = true;
            } catch(err) {
              console.log('got some error while getting data from the api', err.message);
            }
          }
          
          if(gotRespOk) {
            if(Object.keys(jsonResp).length > 0) {
              try {
                if(Array.isArray(jsonResp.style.sizes) && jsonResp.style.sizes.length > 0 && jsonResp.style.sizes[0].styleId) {
                  sku = jsonResp.style.sizes[0].styleId;
                }
                mpc = sku;
                if(jsonResp.style.flags.outOfStock) {
                  availability = "Out of Stock";
                } else {
                  availability = "In Stock";
                }

                addElementToDocument('availability', availability);
                addElementToDocument('sku', sku);
                addElementToDocument('mpc', mpc);
              } catch(err) {
                console.log('got some errro while extracting data from api', err.message);
              }
            } else {
              console.log('we have the api responded successfully but it is empty');
            }
          } else {
            console.log('either the response was not ok or it could not be parsed into json');
          }

        } else {
          console.log('we do not have the id yet to call tha api');
        }
        
      }

      if(!availability) {
        console.log('still do not have availability');
        let availabilityXpath = '//div[contains(@class,"add-to-bag")]';
        console.log('availabilityXpath', availabilityXpath);
        let elm = document.evaluate(availabilityXpath, document, null, 7, null);
        let text = '';
        if(elm && elm.snapshotLength > 0) {
          text = elm.snapshotItem(0).textContent;
          if(text) {
            text = text.trim();
            console.log('current text', text);
            if(text.toLowerCase().includes("add to bag")) {
              text = "In Stock";
            } else {
              text = "Out of Stock";
            }
          }
        }
        availability = text;
        addElementToDocument('availability', availability);
      }
      

      const specsXpath = document.evaluate("//h4[contains(text(), 'pecifications')]/following-sibling::div[@class='index-tableContainer']/div[@class='index-row']", document, null, XPathResult.ANY_TYPE, null);
      // eslint-disable-next-line prefer-const
      if (specsXpath) {
        let specsArr = [];
        for (let spec = specsXpath.iterateNext(); spec; spec = specsXpath.iterateNext()) {
          specsArr.push(spec.innerText);
        }
        addElementToDocument('specifications', specsArr.join(' || ').replace(/\s{2,}|\n/g, ' '));
      }

      const warranty = getElementByXpath('//p[@class="pdp-product-description-content"]/text()[position() = last()]')
        ? getElementByXpath('//p[@class="pdp-product-description-content"]/text()[position() = last()]').textContent : '';
      if (warranty.match('arranty')) addElementToDocument('warranty', warranty);

      try {
        let ingredientsType1 = getElementByXpath('//p[contains(@class,"description-content")]//b[text()="Ingredients"]/following-sibling::ul');
        let ingredientsType2 = getElementByXpath("//p[@class='pdp-product-description-content']//b[contains(text(),'INGREDIENTS') or contains(text(),'Ingredients') or contains(text(),'ingredient')][1]/following-sibling::text()[1]");
        if (ingredientsType1) {
          addElementToDocument('ingredientList', ingredientsType1.textContent);
        }
        else {
          addElementToDocument('ingredientList', ingredientsType2.textContent);
        }
      }
      catch (e) {
        console.log("ingredients section not present.");
      }

    }, idXpath, idPresent);
    await context.extract(productDetails, { transform });
  },
};
