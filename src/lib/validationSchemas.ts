import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const AddAuthorizedUserSchema = Yup.object({
  email: Yup.string().email().required(),
  role: Yup.string().oneOf(['TEACHER', 'ADMIN']).required().default('TEACHER'),
});

export const EditUserSchema = Yup.object({
  id: Yup.number().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  role: Yup.string().oneOf(['TEACHER', 'ADMIN']),
});
