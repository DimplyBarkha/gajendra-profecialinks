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
      if (row.specifications) {
        let specs = '';
        let xpath = ''
        for (const item of row.specifications) {
          specs += clean(item.text.replace('\n', ':').replace("\n","").replace("\n","")) + ' || ';
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
        
        if (row.privacyPolicy) {
          if (row.privacyPolicy.length) {
            row.privacyPolicy[0].text = 'Yes';
          } else {
            row.privacyPolicy = [{ text: 'No', xpath: '' }];
          }
        }

      if (row.gtin) {
          var text = row.gtin[0].text;
          row.gtin[0].text = clean(String(text).trim().split(" ")[2].split(")")[0]);
        }

        if(row.alternateImages){
          const text = String(row.alternateImages.length);
          row.secondaryImageTotal = [{ text: text, xpath: '' }];
        }

        if(row.quantity){
          var text = row.quantity[0].text;
          var txtArray = String(text).split("\n");
          txtArray.forEach((x,index)=> {
            if(x.indexOf("Capacidade Total") > -1){
              var str = txtArray[index].split(":");
              if(str.length == 2){
                row.quantity[0].text = clean(str[1]);
              }
            }
            else{
              row.quantity[0].text = "";
            }
          })
        }

      if(row.weightNet){
      var text = row.weightNet[0].text;
      var txtArray = String(text).split("\n");
      txtArray.forEach((x,index)=> {
        var str = txtArray[index].split(" ");
        str.forEach((y,ind)=>{
          if(y.indexOf("Peso") > -1){
          var str1 = str[ind].split(":");
            if(str1.length == 2){
            row.weightNet[0].text = clean(str1[1]);
            }
          }
          else{
            row.weightNet[0].text = "";
          }
        })
      })
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));

      if(row.manufacturerImages){
        row.manufacturerImages.forEach(x =>{
          if(x.text.indexOf("https") == -1){
            x.text = 'https:' + x.text;
          }
        })
      }
    }
  }
  return data;
};

module.exports = { transform };