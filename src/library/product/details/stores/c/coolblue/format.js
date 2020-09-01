/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.shippingDimensions) {
        const shippingDimensionsArray = row.shippingDimensions.map((item) => {
          return item.text;
        });
        row.shippingDimensions = [{ text: shippingDimensionsArray.join(' x '), xpath: row.shippingDimensions[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n \n/gm, '| ').replace(/\n \n /gm, '').replace(/\n/g, '') : '';
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join('|'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n /gm, '| ').replace(/\n \n /gm, ': ').replace(/\n/g, '') : '';
        });
        row.specifications = [{ text: specificationsArr.join('|'), xpath: row.specifications[0].xpath }];
      }
      if (row.productOtherInformation) {
        const productOtherInformationArr = row.productOtherInformation.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n \n \n/gm, '| ').replace(/\n \n \n \n /gm, '| ').replace(/\n \n /gm, ': ').replace(/\n/g, '') : '';
        });
        row.productOtherInformation = [{ text: productOtherInformationArr.join('|'), xpath: row.productOtherInformation[0].xpath }];
      }
      if (row.technicalInformationPdfPresent) {
        const technicalInformationPdfPresentArr = row.technicalInformationPdfPresent.map((item) => {
          return (typeof (item.text) === 'string') && (item.text !== 0) ? 'Yes' : 'No';
        });
        row.technicalInformationPdfPresent = [{ text: technicalInformationPdfPresentArr.join(), xpath: row.technicalInformationPdfPresent[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
