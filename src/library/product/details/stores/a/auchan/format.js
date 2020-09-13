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
    }
  }
  return data;
};

module.exports = { transform };