const logger = require("./logger");

module.exports = (error, params = {}) => {
  if (error.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return { status: 400, message: error.message, error: errors };
  }

  if (error.code && error.code === 11000) {
    return {
      status: 400,
      message: {
        [Object.keys(error.keyValue)[0]]: `${
          Object.keys(error.keyValue)[0]
        } already exists.`,
      },
    };
  }

  params = JSON.stringify(params);
  logger.error({ params, error });
  return { status: 500, message: error.message, error };
};