
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	let getServingAndUom = function (textFromUI) {
		let additionalInfoArray = textFromUI.match(new RegExp(/\((.+)\)/g));
		let additionalInfo = additionalInfoArray && additionalInfoArray.length > 0 ? additionalInfoArray[0] : false
		textFromUI = additionalInfo ? textFromUI.replace(additionalInfo, '') : textFromUI;


		if (textFromUI.includes('µg')) {
			let calories = textFromUI.split('µg')
			return {
				calorieValue: calories[0],
				uom: 'µg'
			}
		}

		let uomArray = textFromUI.match(new RegExp(/[a-z]+/g));


		let uom = uomArray!==null && uomArray.length > 0 ? textFromUI.match(new RegExp(/[a-z]+/g))[0] : false;
		if (uom) {
			const calorieValue = textFromUI.replace(uom, '');
			return {
				calorieValue: calorieValue.replace('<', ''),
				uom: uom
			}
		} else {
			return {
				calorieValue: '',
				uom: ''
			}
		}

	}

	for (const { group } of data) {
		for (const row of group) {
			if (row.sku) {
				let skuUrl = row.sku[0].text;
				row.sku[0].text = skuUrl.split('-')[skuUrl.split('-').length - 1];
			}

			if (row.directions) {
				let directionsText = row.directions[0].text;
				directionsText = directionsText.replace('Directions...', '').trim();
				row.directions = [{ text: directionsText }];
			}

			if (row.warnings) {
				let warnings = row.warnings;
				let index = null;
				for (let i = 0; i < warnings.length; i++) {
					index = warnings[i].text.includes('Safety Warning') ? i : null;
					if (index !== null) {
						break;
					}
				}
				index !== null ? row.warnings = [{ text: warnings[index + 1].text }] : delete row.warnings
			}

			if (row.caloriesPerServing) {
				const calories = row.caloriesPerServing[0].text.split('/');
				if (calories.length > 2) {
					row.caloriesPerServing = [{ text: `${calories[0]}/${calories[1]}` }]
				}
			}

			if (row.totalFatPerServing) {
				const serving = getServingAndUom(row.totalFatPerServing[0].text)
				row.totalFatPerServing = [{ text: serving.calorieValue }];
				row.totalFatPerServingUom = [{ text: serving.uom }]
			}

			if (row.saturatedFatPerServing) {
				const serving = getServingAndUom(row.saturatedFatPerServing[0].text)
				row.saturatedFatPerServing = [{ text: serving.calorieValue }];
				row.saturatedFatPerServingUom = [{ text: serving.uom }]
			}

			if (row.sodiumPerServing) {
				const serving = getServingAndUom(row.sodiumPerServing[0].text)
				row.sodiumPerServing = [{ text: serving.calorieValue }];
				row.sodiumPerServingUom = [{ text: serving.uom }]
			}

			if (row.totalCarbPerServing) {
				const serving = getServingAndUom(row.totalCarbPerServing[0].text)
				row.totalCarbPerServing = [{ text: serving.calorieValue }];
				row.totalCarbPerServingUom = [{ text: serving.uom }]
			}

			if (row.dietaryFibrePerServing) {
				const serving = getServingAndUom(row.dietaryFibrePerServing[0].text)
				row.dietaryFibrePerServing = [{ text: serving.calorieValue }];
				row.dietaryFibrePerServingUom = [{ text: serving.uom }]
			}

			if (row.totalSugarsPerServing) {
				const serving = getServingAndUom(row.totalSugarsPerServing[0].text)
				row.totalSugarsPerServing = [{ text: serving.calorieValue }];
				row.totalSugarsPerServingUom = [{ text: serving.uom }]
			}

			if (row.proteinPerServing) {
				const serving = getServingAndUom(row.proteinPerServing[0].text)
				row.proteinPerServing = [{ text: serving.calorieValue }];
				row.proteinPerServingUom = [{ text: serving.uom }]
			}

			if (row.vitaminAPerServing) {
				const serving = getServingAndUom(row.vitaminAPerServing[0].text)
				row.vitaminAPerServing = [{ text: serving.calorieValue }];
				row.vitaminAPerServingUom = [{ text: serving.uom }]
			}

			if (row.vitaminCPerServing) {
				const serving = getServingAndUom(row.vitaminCPerServing[0].text)
				row.vitaminCPerServing = [{ text: serving.calorieValue }];
				row.vitaminCPerServingUom = [{ text: serving.uom }]
			}

			if (row.calciumPerServing) {
				const serving = getServingAndUom(row.calciumPerServing[0].text)
				row.calciumPerServing = [{ text: serving.calorieValue }];
				row.calciumPerServingUom = [{ text: serving.uom }]
			}

			if (row.ironPerServing) {
				const serving = getServingAndUom(row.ironPerServing[0].text)
				row.ironPerServing = [{ text: serving.calorieValue }];
				row.ironPerServingUom = [{ text: serving.uom }]
			}

			if (row.saltPerServing) {
				const serving = getServingAndUom(row.saltPerServing[0].text)
				row.saltPerServing = [{ text: serving.calorieValue }];
				row.saltPerServingUom = [{ text: serving.uom }]
			}

			if (row.pricePerUnit) {
				const serving = getServingAndUom(row.pricePerUnit[0].text)
				row.pricePerUnit = [{ text: serving.calorieValue }];
				row.pricePerUnitUom = [{ text: serving.uom }]
			}
		}
	}

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
		el.text = clean(el.text).trim();
	}))));

	return data;
};

module.exports = { transform };
