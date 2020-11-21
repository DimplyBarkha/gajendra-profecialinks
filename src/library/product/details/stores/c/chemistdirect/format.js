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
            
            if (row.privacyPolicy) {
              if (row.privacyPolicy.length) {
                row.privacyPolicy[0].text = 'Yes';
              } else {
                row.privacyPolicy = [{ text: 'No', xpath: '' }];
              }
            }

          if (row.alternateImages) {
            row.alternateImages.forEach(item => {
              if(item.text.indexOf("http") == -1)
                item.text = "https:" + item.text;
            });
          }

          if(row.listPrice){
            row.listPrice[0].text = (row.listPrice[0].text).replace("Was","").trim()
          }

        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }
    }
    return data;
  };
  module.exports = { transform };
  