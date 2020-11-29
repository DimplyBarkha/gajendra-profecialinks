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
        if (row.imageZoomFeaturePresent) {
          if (row.imageZoomFeaturePresent.length) {
            row.imageZoomFeaturePresent[0].text = 'Yes';
          } else {
            row.imageZoomFeaturePresent = [{ text: 'No', xpath: '' }];
          }
        }

        if (row.customerServiceAvailability) {
          if (row.customerServiceAvailability.length) {
            row.customerServiceAvailability[0].text = 'Yes';
          } else {
            row.customerServiceAvailability = [{ text: 'No', xpath: '' }];
          }
        }
        if (row.termsAndConditions) {
          if (row.termsAndConditions.length) {
            row.termsAndConditions[0].text = 'Yes';
          } else {
            row.termsAndConditions = [{ text: 'No', xpath: '' }];
          }
        }
        if (row.privacyPolicy) {
          if (row.privacyPolicy.length) {
            row.privacyPolicy[0].text = 'Yes';
          } else {
            row.privacyPolicy = [{ text: 'No', xpath: '' }];
          }
        }


        // if(row.nameExtended){
        //   row.nameExtended[0].text = (row.nameExtended[0].text).replace("Größe","").replace(":","") + " " + row.variantInformation[0].text;
        // }
        if(row.aggregateRating){
          row.aggregateRating[0].text = (row.aggregateRating[0].text).replace(".",",");
        }

        if(row.availabilityText){
          var isDisabled = 0;
          const classes = (row.availabilityText[0].text).split(" ");
          classes.forEach(x => {
            if(x == "disabled"){
              isDisabled = 1;
            }
          })
          if(isDisabled == 1)
            row.availabilityText[0].text = "Out of Stock"
          else
            row.availabilityText[0].text = "In Stock"
        }
        
      }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }))));
    return data;
  };
  
  module.exports = { transform };