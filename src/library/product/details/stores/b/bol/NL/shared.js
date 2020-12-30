/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.priceSufix) {
        const sufixVal = row.priceSufix[0].text;
        if (sufixVal === '-') {
          row.price[0].text = row.price[0].text.replace(',-', '');
        }
        delete row.priceSufix
      }

      if (row.availabilityText) {
        const prodInfo = JSON.parse(row.availabilityText[0].text);
        if (prodInfo && prodInfo.offers && prodInfo.offers.availability) {
          row.availabilityText[0].text = prodInfo.offers.availability
        } else {
          delete row.availabilityText
        }
      }

      if (row.gtin) {
        const prodInfo = JSON.parse(row.gtin[0].text);
        if (prodInfo && prodInfo.gtin13) {
          row.gtin[0].text = prodInfo.gtin13
        } else {
          delete row.gtin
        }
      }

      if (row.shippingInfo) {
        row.shippingInfo[0].text = row.shippingInfo[0].text.replace('Verkoop door:', '')
      }

      if (!row.shippingDimensions && row.shippingDimensionsSplit && row.shippingDimensionsSplit[0].text !== 'xx') {
        row.shippingDimensions = [{ text: row.shippingDimensionsSplit[0].text }];
        delete row.shippingDimensionsSplit;
      }

      let specifications = '';
      if (row.specifications && row.specTitle && row.specValue) {
        for (let i = 0; i < row.specTitle.length; i++) {
          specifications += `${row.specTitle[i].text} : ${row.specValue[i].text} || `;
        }
        specifications = specifications.substring(0, specifications.lastIndexOf('||') - 1).trim();
        row.specifications = [{ text: specifications }];
      }

      if (row.technicalInformationPdfPresent && row.technicalInformationPdfPresent[0].text === 'Bekijk de handleiding') {
        row.technicalInformationPdfPresent = [{ text: 'Yes' }]
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = ` || ${row.additionalDescBulletInfo[0].text}`;
      }

      if (row.productOtherInformationDD && row.productOtherInformationDT) {
        row.productOtherInformation = [{ text: '' }];
        let prodOtherInfo = '';
        for (let i = 0; i < row.productOtherInformationDD.length; i++) {
          prodOtherInfo += `${row.productOtherInformationDT[i].text} : ${row.productOtherInformationDD[i].text} | `
        }
        prodOtherInfo = prodOtherInfo.substring(0, prodOtherInfo.lastIndexOf('|') - 1).trim();
        row.productOtherInformation = [{ text: prodOtherInfo }]
      }
    }
  }

  // Clean up data
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
