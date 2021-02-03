/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
      .replace(/\r\n|\r|\n/g, " ")
      .replace(/&amp;nbsp;/g, " ")
      .replace(/&amp;#160/g, " ")
      .replace(/\u00A0/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, " ")
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, "")
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, " ");
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        })
      )
    )
  );

  function getFeature(array, find) {
    let baseArrayFeature = array[0].text.split(" ");
    var featureKey = baseArrayFeature.indexOf(find);
    if (featureKey) {
      var featureName = baseArrayFeature[featureKey + 1];
      return featureName;
    } else {
      return;
    }
  }

  for (const { group } of data) {
    for (const row of group) {
      try {
        let baseObject = row;

        if (baseObject.manufacturer) {
          let manufacturerName = getFeature(
            baseObject.manufacturer,
            "Fabricante"
          );
          if (manufacturerName) {
            row.manufacturer = [
              {
                text: manufacturerName,
              },
            ];
          }
        }
        if(baseObject.availabilityText){
            var availablity = baseObject.availabilityText
            var jsonavailable= JSON.parse(availablity[0].text);

            console.log(jsonavailable.offers.availability);
            if(jsonavailable.offers.availability == "http://schema.org/InStock"){
                row.availabilityText = [
                    {
                      text: "In Stock"
                    },
                  ];
            }
            else{
                row.availabilityText = [
                    {
                      text: "Out of Stock"
                    },
                  ];
            }
        }
        if(row.imageZoomFeaturePresent){
          row.imageZoomFeaturePresent = [
            {
              text: "Yes"
            },
          ];
        }
        if(row.customerServiceAvailability){
          row.customerServiceAvailability =[
            {
              text: "Yes"
            }
          ]
        }
        if(row.aggregateRating){
          var rating = row.aggregateRating[0].text
          var rate = rating.replace(".", ",");
          row.aggregateRating =[
            {
              text: rate
            }
          ]
        }
      } catch (exception) {
        console.log("Error in transform", exception);
      }
    }
  }
  return data;
};

module.exports = {
  transform,
};
