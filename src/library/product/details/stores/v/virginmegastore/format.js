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
      if (row.category) {
        row.category.shift();
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.trim() === 'Add to bag' || item.text.trim() === 'إضافة إلى عربة التسوق') ? 'In Stock' : 'Out of Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
      if (row.productOtherInformation) {
        const productOtherInformationArr = row.productOtherInformation.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n/g, ' | ').replace(/\n \n \n \n/g, ' | ').replace(/\n \n/g, ':').replace(/\n/g, '| ') : '|';
        });
        row.productOtherInformation = [{ text: productOtherInformationArr.join('|'), xpath: row.productOtherInformation[0].xpath }];
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n/g, ' | ').replace(/\n \n \n \n/g, ' | ').replace(/\n \n/g, ':').replace(/\n/g, ' | ') : '|';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n/g, ' | ').replace(/\n \n \n \n/g, ' | ').replace(/\n \n/g, ':') : '|';
        });
        row.specifications = [{ text: specificationsArr.join('|'), xpath: row.specifications[0].xpath }];
      }
      if (row.legalDisclaimer) {
        const legalDisclaimerArr = row.legalDisclaimer.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/g, '| ') : '|';
        });
        row.legalDisclaimer = [{ text: legalDisclaimerArr.join('|'), xpath: row.legalDisclaimer[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
