const { CLIEngine } = require('eslint');

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
        row.variants = [{ text: variantArray.join('|') }];
      }
      if (row.productOtherInformation) {
        const otherInformation = row.productOtherInformation.map((item) => {
          return item.text.replace('\n', '');
        });
        row.productOtherInformation = [{ text: otherInformation.join('||'), xpath: row.productOtherInformation[0].xpath }];
      }
      if (row.specifications) {
        const specifications = row.specifications.map((item) => {
          return item.text;
        });
        row.specifications = [{ text: specifications.join('||') }];
      }
      if (row.shippingDimensions) {
        const shippingDimensions = row.shippingDimensions.map((item) => {
          return item.text;
        });
        row.shippingDimensions = [{ text: shippingDimensions.join('x') }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfo = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfo.join('|'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.description) {
        const rowData = row.description.map((item) => {
          return item.text ? JSON.parse(item.text) : {};
        });
        // @ts-ignore
        let description = '';
        if (rowData && rowData.length) {
          rowData[0].standardized.sections.forEach(itemsObj => {
            if (itemsObj && itemsObj.items.length) {
              itemsObj.items.forEach(element => {
                if (element.type === 'TEXT') {
                  if (!description.length) {
                    const firstOccuranceIndex = element.content.search(/<h1>/) + 1;
                    description += element.content.substr(0, firstOccuranceIndex).replace(/<h1>/, '') + element.content.slice(firstOccuranceIndex).replace(/<h1>/, '|').replace(/li/, '||').replace(/(<([^>]+)>)/ig, '');
                  } else {
                    description += element.content.replace(/<h1>/, '|').replace(/li/, '||').replace(/(<([^>]+)>)/ig, '');
                  }
                }
              });
            }
          });
        }
        row.description = [{ text: description.replace(/(<([^>]+)>)/ig, ''), xpath: row.description && row.description[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
