import * as Yup from 'yup';

const AddAPClassSchema = Yup.object().shape({
  name: Yup.string().required('Class name is required'),
  description: Yup.string().required('Description is required'),
  resources: Yup.string(),
  offered: Yup.string().required('Offered status is required'),
  teacherEmail: Yup.string().email('Invalid email').required('Teacher email is required'),
  subjectType: Yup.string()
    .oneOf(['Math', 'Science', 'History', 'English', 'Art'], 'Invalid subject type')
    .required('Subject type is required'),
  prerequisites: Yup.string(),
  gradeLevels: Yup.array()
    .of(Yup.number().oneOf([9, 10, 11, 12], 'Invalid grade level'))
    .min(1, 'At least one grade level must be selected'),
  preRequisiteIds: Yup.array().of(Yup.number()).optional(),
});

export default AddAPClassSchema;
