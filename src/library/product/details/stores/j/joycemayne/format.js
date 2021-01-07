/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
     
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach((manufacturerImagesItem) => {
          if (!manufacturerImagesItem.text.toLowerCase().includes('https')) {
            manufacturerImagesItem.text = 'https:' + manufacturerImagesItem.text;
          }
        });
      }

      if (row.inTheBoxUrl) {
        let manuImages = row.inTheBoxUrl;
        row.inTheBoxUrl = [];
        manuImages.forEach(ele => {
       
          let extractfirsturl = ele.text.split(',');
          var obj = {};
          let extracturlbeforeExtn = extractfirsturl[0].split(" ");          
          obj.text = extracturlbeforeExtn[0];     

          if(obj.text.startsWith("//media")){
            obj.text = 'https:'+extracturlbeforeExtn[0];
            row.inTheBoxUrl.push(obj);
          }else{
            obj.text = 'https://media.flixfacts.com/eyekandy/dyson/v11/au/'+extracturlbeforeExtn[0]
            row.inTheBoxUrl.push(obj);           
          }
          
        });
        
        }

      if (row.warranty) {
        row.warranty.forEach((warrantyItem) => {
          warrantyItem.text = warrantyItem.text.replace(/(\n\s*){2,}/g, ' : ');
        });
      }

      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent = [{ text: 'Yes' }];
      } else {
        row.technicalInformationPdfPresent = [{ text: 'No' }];
      }

      if (row.termsAndConditions) {
        row.termsAndConditions = [{ text: 'Yes' }];
      } else {
        row.termsAndConditions = [{ text: 'No' }];
      }

      // if (row.availabilityText) {
      //   row.availabilityText.forEach((availabilityTextItem) => {
      //     if (availabilityTextItem.text.toLowerCase().includes('add to cart') || availabilityTextItem.text.toLowerCase().includes('limited stock')) {
      //       availabilityTextItem.text = 'In Stock';
      //     } else {
      //       availabilityTextItem.text = 'Out Of Stock';
      //     }
      //   });
      // }

      if (row.descriptionBullets) {
        row.descriptionBullets.forEach((descriptionBulletsItem) => {
          if (descriptionBulletsItem.text === 0 || descriptionBulletsItem.text === '0') {
            descriptionBulletsItem.text = '';
          }
        });
      }

      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text.replace(/(\n\s*){4,}/g, ' || ').replace(/(\n\s*){2,}/g, ' : ');
      }

      const shippingDimensionsArray = [];
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach((shippingDimensionsItem) => {
          shippingDimensionsItem.text = shippingDimensionsItem.text.replace(/(\n\s*){2,}/g, ' : ');
          shippingDimensionsArray.push(shippingDimensionsItem.text);
        });
      }
      row.shippingDimensions = [{ text: shippingDimensionsArray.join(' | ') }];

      const additionalDescBulletInfoArray = [];
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach((additionalDescBulletInfoItem) => {
          additionalDescBulletInfoArray.push(additionalDescBulletInfoItem.text);
        });
      }
      row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArray.join(' || ') }];

      if (row.name && row.brandText) {
        row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
      }

      if (row.imageAlt) {
        row.imageAlt.forEach((imageAltItem) => {
          if (imageAltItem.text === '.') {
            imageAltItem.text = '';
          }
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};
module.exports = { transform };
