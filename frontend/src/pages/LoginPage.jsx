// src/pages/LoginPage.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    // Initial values for the form fields
    const initialValues = {
        email: '',
        password: '',
    };

    // Validation schema using Yup
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
    });

    // Handle form submission
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await axios.post('/api/auth/login', values);
            login(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response.data.message);
            setSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-msg">{error}</p>}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <Field type="email" id="email" name="email" />
                            <ErrorMessage name="email" component="div" className="error-msg" />
                        </div>

                        <div>
                            <label htmlFor="password">Password:</label>
                            <Field type="password" id="password" name="password" />
                            <ErrorMessage name="password" component="div" className="error-msg" />
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
};

export default LoginPage;
