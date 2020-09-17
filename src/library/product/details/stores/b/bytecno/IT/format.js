
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
  const cleanUp = (text) => {
    var dataStr = '';
    dataStr = text.toString()
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

    return dataStr;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        var specificationValues = {};
        var spec = '';
        row.specifications.forEach((ele) => {
          var data = ele.text.split('\n \n');
          if (data.length !== 0) {
            specificationValues[data[0].trim()] = data[1].trim();
            spec += ' || ' + data[0].trim() + ': ' + data[1].trim();
          }
        });
        row.specifications = [{
          text: (spec.trim()).slice(3),
        }];
      }
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text === 'Out of Stock' ? row.availabilityText[0].text : 'In Stock';
      };
      if (row.alternateImages) {
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.category) {
        row.category.pop();
      }
      if (row.weightNet && specificationValues && specificationValues.Peso) {
        row.weightNet[0].text = specificationValues.Peso;
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription = row.manufacturerDescription.map((ele) => {
          ele.text = cleanUp(ele.text);
          return ele;
        });
      }
      if (row.manufacturerImages) {
        var manuImages = row.manufacturerImages[0].text.split(',');
        row.manufacturerImages = [];
        manuImages.forEach(ele => {
          var obj = {};
          obj.text = ele;
          row.manufacturerImages.push(obj);
        });
      }
      if (row.secondaryImageTotal && row.alternateImages) {
        row.secondaryImageTotal = [
          {
            text: row.alternateImages.length,
          }];
      }
      if (row.shippingDimensions) {
        var dimentions = '';
        row.shippingDimensions.forEach((ele) => {
          dimentions += ' * ' + ele.text;
        });
        row.shippingDimensions = [
          {
            text: (dimentions.trim()).slice(3),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
