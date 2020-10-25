/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.specifications) {
          let specs = '';
          let xpath = ''
          for (const item of row.specifications) {
            specs += item.text.replace('\n', ':').replace("\n","").replace("\n","") + ' || ';
            xpath = item.xpath;
          }
          row.specifications = [{ text: specs, xpath: xpath }];
        }
        if (row.imageZoomFeaturePresent) {
          if (row.imageZoomFeaturePresent.length) {
            row.imageZoomFeaturePresent[0].text = 'Yes';
          } else {
            row.imageZoomFeaturePresent = [{ text: 'No', xpath: '' }];
          }
        }
        if (row.termsAndConditions) {
            if (row.termsAndConditions.length) {
              row.termsAndConditions[0].text = 'Yes';
            } else {
              row.termsAndConditions = [{ text: 'No', xpath: '' }];
            }
          }
          if (row.customerServiceAvailability) {
            if (row.customerServiceAvailability.length) {
              row.customerServiceAvailability[0].text = 'Yes';
            } else {
              row.customerServiceAvailability = [{ text: 'No', xpath: '' }];
            }
          }
        if (row.gtin) {
            var text = row.gtin[0].text;
            row.gtin[0].text = String(text).trim().split(" ")[2].split(")")[0];
          }
      }
    }
    return data;
  };
  
  module.exports = { transform };