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
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          let t = item.text.replace(/\n/g, '||')
          item.text = item.text.replace(/More Information/, '');
          item.text = item.text.replace(/Description/, '');
        });
      }

      if (row.additionalDescBulletInfo) {
        let rawText = row.additionalDescBulletInfo;
        let arrayText = rawText[0].text.split('\n');
        let formattedStr = '';
        // console.log(text[0].text);
        for (let i = 0; i < arrayText.length; i++) {
          // console.log(arrayText[i]);
          if (i % 2 == 0) {
            formattedStr += arrayText[i] + ':';
          }
          else {
            if (arrayText.length - 1 != i) {
              formattedStr += arrayText[i] + '||';
            }
            else {
              formattedStr += arrayText[i];
            }
          }
        }
        row.additionalDescBulletInfo[0].text = formattedStr;
      }

      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }

      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          item.text = item.text.replace('.', ' ');
        });
      }

      if (row.availabilityText) {
        let newText = 'In Stock';
        row.availabilityText.forEach(item => {
          if (item.text === 'Discontinued') {
            newText = 'Out Of Stock';
          }
        });
        row.availabilityText = [{ text: newText }];
      }

      if (row.termsAndConditions) {
        let newText;
        row.termsAndConditions.forEach(item => {
          if (item.text === 'Safety Information') {
            newText = 'Yes';
          }
        });
        row.termsAndConditions = [{ text: newText }];
      }

      if (row.privacyPolicy) {
        let newText;
        row.privacyPolicy.forEach(item => {
          if (item.text === 'Safety Information') {
            newText = 'Yes';
          }
        });
        row.privacyPolicy = [{ text: newText }];
      }

      if (row.technicalInformationPdfPresent) {
        let newText;
        row.technicalInformationPdfPresent.forEach(item => {
          if (item.text === 'Technical Information') {
            newText = 'Yes';
          }
        });
        row.technicalInformationPdfPresent = [{ text: newText }];
      }

      if (row.imageZoomFeaturePresent) {
        let newText;
        row.imageZoomFeaturePresent.forEach(item => {
          if (item.text === 'Hover to Zoom') {
            newText = 'Yes';
          }
        });
        row.imageZoomFeaturePresent = [{ text: newText }];
      }

      // if (row.alternateImages) {
      //   const baseUrl = row.alternateImages[0].text.match(/url\("([^?]+)/)[1];
      //   row.alternateImages = row.alternateImages.slice(1).map((elm, index) => {
      //     elm.text = `${baseUrl}_${index + 1}?wid=1920&hei=1080&op_sharpen=1`;
      //     return { text: elm.text };
      //   });
      // }
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }))));
    }
  }
  return data;
};
module.exports = { transform };
