import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../App.css';

const RegisterPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await axios.post('/api/auth/register', values);
            login(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response.data.message);
            setSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <p className="error-msg">{error}</p>}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label>Name:</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" className="error-msg" />
                        </div>

                        <div>
                            <label>Email:</label>
                            <Field type="email" name="email" />
                            <ErrorMessage name="email" component="div" className="error-msg" />
                        </div>

                        <div>
                            <label>Password:</label>
                            <Field type="password" name="password" />
                            <ErrorMessage name="password" component="div" className="error-msg" />
                        </div>

                        <div>
                            <label>Confirm Password:</label>
                            <Field type="password" name="confirmPassword" />
                            <ErrorMessage
                                name="confirmPassword"
                                component="div"
                                className="error-msg"
                            />
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Register
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RegisterPage;
