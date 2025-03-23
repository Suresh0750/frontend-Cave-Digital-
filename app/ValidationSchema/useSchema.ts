
import * as Yup from 'yup';


export const emailSchema = Yup.string()
.email('Invalid email')
.required('Email is required')

export const passwordSchema = Yup.string().trim()
.min(6, 'Password must be at least 6 characters')
.required('Password is required')


export const LoginSchema = Yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
  });

export const SignupSchema = Yup.object().shape({
    name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
    email: emailSchema,
    password: passwordSchema
  });

  