async function implementation (inputs, parameterValues, context, { customGoto }) {
  inputs.context = context;
  await customGoto(inputs);
};

module.exports = {
  dependencies: {
    customGoto: 'action:navigation/goto/domains/am/amazonCustomGoto',
  },
  implementation,
};

