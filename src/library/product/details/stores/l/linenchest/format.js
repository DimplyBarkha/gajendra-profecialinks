/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        const variantArray = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: variantArray.join('||'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.replace('in', 'In');
          item.text = item.text.replace('out', 'Out');
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n\n/g, '||').replace(/\n/g, '||').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      //   if (row.imageZoomFeaturePresent) {
      //     let newText;
      //     row.imageZoomFeaturePresent.forEach(item => {
      //       if (item.text === 'Für größere Ansicht Maus übers Bild ziehen') {
      //         newText = 'Yes';
      //       }
      //     });
      //     row.imageZoomFeaturePresent = [{ text: newText }];
      //   }
      //   if (row.description) {
      //     let newText = '';
      //     row.description.forEach(item => {
      //       newText = item.text.replace(/\n/, '');
      //     });
      //     row.description = [{ text: newText }];
      //   }
      //   if (row.shippingInfo) {
      //     const text = '';
      //     row.shippingInfo.forEach(item => {
      //       item.text = item.text.replace('\n    ', '');
      //     });
      //   }
      //   if (row.productOtherInformation) {
      //     const rawText = row.productOtherInformation;
      //     const arrayText = rawText[0].text.split('\n \n');
      //     let formattedStr = '';
      //     // console.log(rawText[0].text);
      //     for (let i = 0; i < arrayText.length; i++) {
      //       // console.log(arrayText[i]);
      //       if (i % 2 == 0) {
      //         if (i < (arrayText.length - 1)) {
      //           formattedStr += arrayText[i] + '|';
      //         } else {
      //           formattedStr += arrayText[i];
      //         }
      //       } else {
      //         if (arrayText.length - 1 != i) {
      //           formattedStr += arrayText[i] + '';
      //         } else {
      //           formattedStr += arrayText[i];
      //         }
      //       }
      //     }
      //     row.productOtherInformation[0].text = formattedStr;
      //   }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
