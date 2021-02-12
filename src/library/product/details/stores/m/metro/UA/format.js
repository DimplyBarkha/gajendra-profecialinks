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
      if (row.listPrice) {
        row.listPrice[0].text = row.listPrice[0].text.replace('.', ',') + "UAH"
      }
      if (row.price) {
        row.price[0].text = row.price[0].text.replace('.', ',') + "UAH"
      }
      if (row.caloriesFromFatPerServing) {
        row.caloriesFromFatPerServing.forEach(calRow => {
          var arrCal = []
          arrCal = calRow.text.split('\n')
          for (var index = 0; index < arrCal.length; index = index + 2) {
            if (arrCal[index] === 'Калорийность') {
              row.caloriesFromFatPerServing = [{ "text": arrCal[index + 1] }]
            }
            if (arrCal[index] === 'Белки') {
              row.proteinPerServing = [{ "text": arrCal[index + 1] }]
            }
            if (arrCal[index] === 'Жиры') {
              row.totalFatPerServing = [{ "text": arrCal[index + 1] }]
            }
            if (arrCal[index] === 'Углеводы') {
              row.totalCarbPerServing = [{ "text": arrCal[index + 1] }]
            }
          }
        })
      }
      if (row.description) {
        var strJSONString = ''
        strJSONString = row.description[0].text;
        var obj = JSON.parse(strJSONString);
        if (obj.hasOwnProperty('sku')) {
          row.sku = [{ "text": obj.sku }]
          row.variantId = [{ "text": obj.sku }]
        }
        if (obj.hasOwnProperty('gtin13')) {
          if (obj.hasOwnProperty('offers')) {
            if (obj.offers.hasOwnProperty('url')) {
              var strGtin = []
              strGtin = obj.offers.url.split('/')
              row.gtin = [{ "text": strGtin[5] }]
              row.variantId = [{ "text": strGtin[5] }]
            }
          }
        }
        if (obj.hasOwnProperty('description')) {
          row.description = [{ "text": obj.description }]
        }
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };