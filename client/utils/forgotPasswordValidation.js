const forgotPasswordValidation = (data) => {
  const Schema = Joi.object({
    password: Joi.string().required().trim(),
  });
  return Schema.validate(data);
};
export default forgotPasswordValidation;
