/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text += `${item.text.replace('US40_.jpg', '')}`;
        });
        row.nameExtended = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRating => {
          aggregateRating.text = aggregateRating.text.replace('sur', '').trim().replace(',', '.');
        });
      }
      if (row.variantCount) {
        let asinLength = 1;
        row.variantCount.forEach(item => {
          let asinArr = item.text.match(/"asin":"(.*?)"/g);
          asinArr = asinArr ? asinArr.length : '';
          if(asinArr > 1){
            item.text = asinArr;
          }else{
            item.text = asinArr;
          }
          console.log("asinArr", asinArr);
        });
      }
      if (row.price) {
        row.price.forEach(price => {
          price.text = price.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityText => {
          availabilityText.text = availabilityText.text.trim();
        });
      }
      // if (row.description) {
      //   row.description.forEach(item => {
      //     item.text = item.text.replace(/[\r\n]+/gm, '');
      //   });
      // }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += ` || ${item.text.replace(/\n \n/g, ':')}`;
        });
        text = text.trim();
        let descriptionBottom = [];
        if (row.descriptionBottom) {
          descriptionBottom = row.descriptionBottom;
        }
        descriptionBottom = [text, ...descriptionBottom.map(({ text }) => text)];
        row.description = [
          {
            text: descriptionBottom.join(' | '),
          },
        ];
      }
      if (row.manufacturerImages) {
        if (row.manufacturerImages) {
          const secondaryImages = [];
          row.manufacturerImages.forEach(alternateImage => {
            alternateImage.text = alternateImage.text.replace('._AC_US40_', '').trim();
            !secondaryImages.find(({ text }) => text === alternateImage.text) && secondaryImages.push(alternateImage);
          });
          row.manufacturerImages = secondaryImages;
        }
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0,1);
        row.alternateImages.forEach(alternateImages => {
          alternateImages.text = alternateImages.text.replace('._AC_US40_', '');
        });
      }
      if (row.brandText) {
        row.brandText.forEach(brandText => {
          brandText.text = brandText.text.replace('Marque :', '').trim();
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
