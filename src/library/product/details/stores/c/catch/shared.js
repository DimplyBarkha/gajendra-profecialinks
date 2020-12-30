
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {

  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        let altImg = [];
        row.alternateImages.forEach(item => {
          if (row.image[0].text !== item.text) {
            altImg.push({ text: item.text, xpath: item.xpath });
          }
        });
        row.alternateImages = altImg;
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [{ text: text.slice(0, -4) }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [{ text: text.replace(" || Specifications:", "").slice(0, -4) }];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [{ text: text.slice(0, -4) }];
      }
      if (row.color) {
        let text = '';
        row.color.forEach(item => {
          text = `${item.text.replace("Colour:", "")}`;
        });
        row.color = [{ text: text.trim() }];
      }
      if (row.sku) {
        let data = row.sku[0].text.split(":");
        if (data.length > 1) {
          row.sku[0].text = data[1].replace('"', '').replace('\"', '');
        } else {
          row.sku[0].text = "";
        }
      }
     /*  if (row.variantId) {
        let data = row.variantId[0].text.split(":");
        if (data.length > 1) {
          row.variantId[0].text = data[1].replace('"', '').replace('\"', '');
        } else {
          row.variantId[0].text = "";
        }
      } */

      if (row.shippingInfo) {
        let data = row.shippingInfo[0].text.split("\n");
        if (data[1]) {
          row.shippingInfo[0].text = data[1];
        }
      }
      if (row.videos) {
        let text = '';
        row.videos.forEach(item => {
          text = 'https://www.youtube.com/watch?v=' + item.text;
        });
        row.videos = [{ text }];
      }
      if (row.unInterruptedPDP) {
        const str = 'Add to Cart';
        row.unInterruptedPDP.forEach(item => {
          let txt = item.text;

          if (txt.indexOf(str) > -1) {
            txt = txt.substring(txt.indexOf(str) + str.length);
          }
          
          item.text = txt;
        });
      }

    }
  }

  // Default transform function
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
