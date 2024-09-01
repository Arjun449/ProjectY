import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProfilePage = () => {
    const { user, login } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const initialValues = {
        name: user.name || '',
        email: user.email || '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await axios.put('/api/auth/profile', values, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            login(res.data.token);
            setError(null);
        } catch (err) {
            setError(err.response.data.message);
            setSubmitting(false);
        }
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>
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

                        <button type="submit" disabled={isSubmitting}>
                            Save Changes
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProfilePage;
