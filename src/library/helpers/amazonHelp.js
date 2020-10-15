
module.exports.AmazonHelp = class {
  constructor (context, helpers) {
    this.context = context;
    this.helpers = helpers;
  }

  // Function which sets the locale on amazon.com
  async setLocale (wantedZip) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const shouldChangeAddress = await this.helpers.checkAndReturnProp('div#nav-global-location-slot', 'css', 'innerText');

    if (shouldChangeAddress && shouldChangeAddress.includes(wantedZip)) return;

    try {
      await this.helpers.checkAndClick('span#glow-ingress-line2.nav-line-2', 'css', 6000);
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        await this.helpers.checkAndClick('a#GLUXChangePostalCodeLink', 'css', 6000);
      } catch (e) {}
      await this.helpers.checkAndClick('input[aria-label="or enter a US zip code"]', 'css', 6000, wantedZip);
      await this.helpers.checkAndClick('input[aria-labelledby="GLUXZipUpdate-announce"]', 'css', 6000);
      await this.context.evaluate(async function () {
        if (document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]')) {
          document.querySelector('input[aria-labelledby="GLUXZipUpdate-announce"]').click();
        }
      });
      await this.helpers.checkAndClick('button[name="glowDoneButton"]', 'css', 6000);
    } catch (exception) {
      console.log('Failed to update zipcode!');
      throw exception;
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // get array of all other variant codes on the page
  async getVariants () {
    return await this.context.evaluate(() => {
      const variantList = [];
      const variantCards = document.querySelectorAll('li[data-defaultasin]');
      const variantDropdown = document.querySelectorAll('[id*="variation"] option');
      const variantBooks = document.querySelectorAll('[id*="Swatches"]>ul>li a[id][href*="dp"]');

      if (variantBooks) {
        for (let i = 0; i < variantBooks.length; i++) {
          const element = variantBooks[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('href');
          if (vasinRaw !== '') {
            const regex = /\/dp\/([A-Za-z0-9]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantDropdown) {
        for (let i = 0; i < variantDropdown.length; i++) {
          const element = variantDropdown[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('value');
          if (vasinRaw !== '') {
            const regex = /[0-9]{1,},([0-9a-zA-Z]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantCards) {
        for (let i = 0; i < variantCards.length; i++) {
          const element = variantCards[i];
          if (element == null) {
            continue;
          }
          let vasin = element.getAttribute('data-dp-url');
          if (vasin && vasin.includes('/dp/') && vasin.includes('/ref=')) {
            const vasinArr = vasin.split('/dp/');
            vasin = vasinArr.length === 2 ? vasinArr[1].split('/ref=')[0] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          } else {
            vasin = element.getAttribute('data-defaultasin');
          }
        }
      }
      return variantList;
    });
  }

  async addEnhancedContent () {
    const enhancedContent = await this.context.evaluate(async function () {
      let allText = '';
      [...document.querySelectorAll('div.apm-hovermodule-slides')].filter(element => element.style.display !== 'block').forEach((element) => {
        if (element.querySelector('.apm-hovermodule-slides-inner')) {
          allText += element.querySelector('.apm-hovermodule-slides-inner').innerText;
        }
      });
      return document.querySelector('div#aplus') ? document.querySelector('div#aplus').innerText + allText : '';
    });
    await this.helpers.addItemToDocument('added-enhanced-content', enhancedContent);
  }

  async addCurrentSellerInfo (soldByAmazon, soldByAmazonRegex) {
    let CurrentSeller = await this.context.evaluate(async function () {
      return document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
    });

    const CurrentSellerPrice = await this.context.evaluate(async function () {
      return document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
    });

    let CurrentSellerShipping = await this.context.evaluate(async function () {
      return document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';
    });

    let CurrentSellerPrime = await this.context.evaluate(async function () {
      return document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';
    });

    if (CurrentSeller && CurrentSeller.search(soldByAmazon) < 0 && CurrentSeller.match(soldByAmazonRegex)) {
      CurrentSeller = (CurrentSeller.match(soldByAmazonRegex)[1]) ? CurrentSeller.match(soldByAmazonRegex)[1] : CurrentSeller.match(soldByAmazonRegex)[2];
      if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
      if (CurrentSellerPrime.includes('Details')) {
        CurrentSellerPrime = 'YES';
      } else {
        CurrentSellerPrime = 'NO';
      }

      await this.helpers.addItemToDocument('ii_otherSellersName', CurrentSeller);
      await this.helpers.addItemToDocument('ii_otherSellersPrice', CurrentSellerPrice);
      await this.helpers.addItemToDocument('ii_otherSellersShipping', CurrentSellerShipping);
      await this.helpers.addItemToDocument('ii_otherSellersPrime', CurrentSellerPrime);
      console.log('CurrentSeller', CurrentSeller);
      console.log('CurrentSellerPrice', CurrentSellerPrice);
      console.log('CurrentSellerShipping', CurrentSellerShipping);
      console.log('CurrentSellerPrime', CurrentSellerPrime);
    }
  }
};
