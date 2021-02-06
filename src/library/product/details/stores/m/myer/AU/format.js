/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    for (let row of group) {
      if (row.additionalDescBulletInfo) {
        let arr_info = [];
        row.additionalDescBulletInfo.forEach(item => {
          arr_info.push(item.text);
        });
        row.additionalDescBulletInfo = [{ 'text': '' + arr_info.join(' || ') }];
      }
      if (row.descriptionBullets) {
        row.descriptionBullets = [{ 'text': row.descriptionBullets.length, 'xpath': row.descriptionBullets[0].xpath }];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.slice(1, -3);
          item.text = item.text.replace("http://schema.org/", '');
          if (item.text == 'LimitedAvailability') {
            row.availabilityText = [{ "text": 'LowStock', "xpath": row.availabilityText[0].xpath }]
          }
          if (item.text == 'InStock') {
            row.availabilityText = [{ "text": 'In Stock', "xpath": row.availabilityText[0].xpath }]
          }
          if (item.text != 'InStock' && item.text != 'LimitedAvailability') {
            row.availabilityText = [{ "text": 'Out of Stock', "xpath": row.availabilityText[0].xpath }]
          }
        });
      }
      if (row.variants) {

        let value = []
        //console.log('Hey there')
        for (let index = 0; index < row.variants.length; ++index) {
          value.push(row.variants[index].text);
          //console.log(index, value);
        }
        row.variants = [{ "text": value.join(' | '), "xpath": row.variants[0].xpath }]
      }
      if (row.variantInformation) {
        var strVariantInfo = ''
        row.variantInformation.forEach(item => {
          strVariantInfo = strVariantInfo + item.text + ' | '
        })
        row.variantInformation = [{ "text": strVariantInfo, "xpath": row.variantInformation[0].xpath }]
      }
      if (row.description) {
        let description_ar = [];
        row.description.forEach(item => {
          description_ar.push(item.text);
        });
        if (description_ar.length) {
          row.description = [{ "text": description_ar.join(" "), 'xpath': row.description[0].xpath }];
        }
      }
      if (row.ingredientsList) {
        row.ingredientsList.forEach(item => {
          item.text = item.text.replace("Product Ingredients: ", '');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.slice(1, -1);
          item.text = '$' + item.text;
        });
      }
      if(row.variantId){
        row.variantId.forEach(item=>{
          //console.log('item.text',item.text);
          let match=item.text.match(/_Colour_(.+?)_/);
          //console.log('match',match);
          if(match){
            item.text=match[1];
          }
        });
        if(row.variantId.length>1){
          row.variantId.splice(1,row.variantId.length-1);
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };