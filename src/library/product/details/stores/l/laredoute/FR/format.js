/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages = row.alternateImages.map((ele) => {
          ele.text = ele.text.replace('72by72', '680by680');
          return ele;
        });
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.color) {
        var colorText = row.color[0].text.split(',');
        row.color[0].text = colorText[0];
      }
      if (row.largeImageCount) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let rawText = row.additionalDescBulletInfo[0].text;
        if (row.additionalDescBulletInfo.length > 1) {
          rawText = '';
          row.additionalDescBulletInfo.forEach(element => {
            rawText += '\n' + element.text;
          });
        }
        let desc = (rawText.split('\n')).filter(ele => ele !== ' ');
        desc = (desc.filter(s => /^[^a-z]/i.test(s))).map((ele) => ele.substring(3));
        var bullets = [];
        desc.forEach(element => {
          var obj = {};
          obj.text = element;
          bullets.push(obj);
        });
        row.additionalDescBulletInfo = bullets;
      }
      if (row.listPrice) {
        if (row.listPrice[0].text === row.price[0].text) {
          delete row.listPrice;
        }
      }
      if (row.nameExtended) {
        row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text + ' - ' + row.color[0].text;
      }
      if (row.descriptionBullets) {
        row.descriptionBullets[0].text = row.additionalDescBulletInfo.length;
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n/g, '');
      }
      if (row.ratingCount) {
        let pr = row.ratingCount[0].text;
        pr = pr.replace(/^\((.+)\)$/, '$1');
        row.ratingCount = [
          {
            text: pr,
            xpath: row.ratingCount[0].xpath,
          },
        ];
      }
      if (row.variantAsins) {
        let text = '';
        if (row.variantAsins.length > 1) {
          row.variantAsins.forEach(item => {
            text += `${item.text} | `;
          });
          row.variantAsins = [
            {
              text: text.slice(0, -3),
            },
          ];
        } else {
          delete row.variantAsins;
          delete row.variants;
          delete row.variantInformation;
          row.variantCount = [
            {
              text: 1,
            },
          ];
        }
      }
      if (row.variants && row.variantAsins) {
        row.variants = [{
          text: row.variantAsins[0].text,
        }];
      }
      if (row.variantAsins && row.variantCount) {
        row.variantCount = [
          {
            text: (row.variantAsins[0].text.split('|')).length,
          },
        ];
      }
      if (row.variants && row.variantInformation) {
        let text = '';
        const colors = row.variantInformation[0].text.split(',');
        colors.forEach(ele => {
          text += 'color: ' + ele + ' | ';
        });
        row.variantInformation = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
