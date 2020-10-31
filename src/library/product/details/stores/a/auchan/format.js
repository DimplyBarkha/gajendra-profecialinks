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
    for (const row of group) {
      if (row.specifications) {
        let specs = '';
        let xpath = ''
        for (const item of row.specifications) {
          specs += item.text.replace('\n', ':') + ' || ';
          xpath = item.xpath;
        }
        row.specifications = [{ text: specs, xpath: xpath }];
      }
      if (row.availabilityText) {
        let stockPos = row.availabilityText[0].text;
        if (stockPos == "inStock")
          stockPos = "In Stock";
        else if (stockPos == "outOfStock")
          stockPos = "Out Of Stock";

        row.availabilityText[0].text = stockPos;
      }
      if (row.aggregateRating) {
        var i = 0;
        for (var aggRat of row.aggregateRating) {
          row.aggregateRating[i].text = (parseFloat(aggRat.text).toFixed(2)).replace('.', ',');
          i++;
        }
      }
      if (row.manufacturerImages) {
        var mI = [];
        for (var image of row.manufacturerImages) {
          if (image.text.indexOf('.jpg') !== -1 || image.text.indexOf('.jpeg') !== -1) {
            mI.push({
              text: image.text.indexOf('https:') === -1 ? ('https:' + image.text) : image.text,
              xpath: image.xpath
            })
          }
        }
        row.manufacturerImages = mI;
      }
      if (row.image) {
        var pI = [];
        for (var item of row.image) {
          pI.push({
            text: item.text.indexOf('https:') === -1 ? ('https:' + item.text) : item.text,
            xpath: item.xpath
          })
        }
        row.image = pI;
      }
      if (row.alternateImages) {
        var aI = [];
        for (var item of row.alternateImages) {
          aI.push({
            text: item.text.indexOf('https:') === -1 ? ('https:' + item.text) : item.text,
            xpath: item.xpath
          })
        }
        row.alternateImages = aI;
      }
      if (row.technicalInformationPdfPresent) {
        if (row.technicalInformationPdfPresent.length) {
          row.technicalInformationPdfPresent[0].text = 'Yes';
        } else {
          row.technicalInformationPdfPresent = [{ text: 'No', xpath: '' }];
        }
      }
      if (row.customVariantId && row.customVariantId.length) {
        row.varientId = [{
          text: row.customVariantId[0].text,
          xpath: row.customVariantId[0].xpath
        }]
      }
      if (row.servingSizeUom && row.servingSizeUom.length) {
        row.servingSizeUom = [{
          text: row.servingSizeUom[0].text.replace(/\d+/, ''),
          xpath: ''
        }]
      }

      if (row.imageZoomFeaturePresent && row.imageZoomFeaturePresent.length) {
        row.imageZoomFeaturePresent = [{
          text: 'Yes',
          xpath: ''
        }]
      } else {
        row.imageZoomFeaturePresent = [{
          text: 'No',
          xpath: ''
        }]
      }
    }
  }
  data = cleanUp(data, undefined);
  return data;
};

module.exports = { transform };