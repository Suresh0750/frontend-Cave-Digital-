import * as Yup from 'yup';


const titleSchema = Yup.string().trim()     
      .min(3, 'Title must be at least 3 characters')
      .required('Title is required');

const descriptionSchema = Yup.string().trim().min(10, 'Description must be at least 10 characters')
      .required('Description is required');

export const TaskSchema = Yup.object().shape({
    title: titleSchema,
    description: descriptionSchema,
  });

export const EditTaskSchema = Yup.object().shape({
    _id: Yup.string().required('Task ID is required'),
    title: titleSchema,
    description: descriptionSchema,
  });

