import { useState } from 'react';
import styles from './settings.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { hideOverlay, showOverlay } from '../../store/actions/global';
import { toast } from 'react-toastify';
import Language from '../../components/shared/language/Language';
import { useTranslation } from 'react-i18next';

const PassInput = ({ label, id, placeholder, validationError, isError, ...props }) => {

  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className={`field ${styles['field']}`}>
      <p><span>*</span><span>{label}</span></p>
      <input
        type={isVisible ? 'text' : 'password'}
        id={id}
        placeholder={placeholder}
        {...props}
      />
      <span
        className={`password-icon old-password-icon ${isVisible ? 'active' : ''}`}
        onClick={() => setIsVisible(!isVisible)}
      ></span>
      <span className={`${styles['let-know']} ${isError ? styles['active'] : ''}`}>{validationError}</span>
    </div>
  )
}
PassInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  validationError: PropTypes.string,
  isError: PropTypes.bool,
}


const Settings = () => {

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { userData, token } = useSelector((state) => state.auth)

  // ==> Yup - Formik validations <==
  const validationSchema = Yup.object().shape({
    oldPass: Yup.string().required(),
    newPass: Yup.string().required(),
    confirmPass: Yup.string().required()
  })

  const formik = useFormik({
    initialValues: {
      oldPass: '',
      newPass: '',
      confirmPass: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.newPass !== values.confirmPass) {
        toast.error('Password does not match')
      } else {
        dispatch(showOverlay())
        const response = await fetch(import.meta.env.VITE_APP_DISPATCH_URL + "/user102", {
          method: "post",
          headers: {
            "Content-Type": "text/plain",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            oldpass: values.oldPass,
            newpassword: values.confirmPass
          }),
        })

        const json = await response.json();
        if (json?.error || !response.ok) {
          toast.error(json.error?.message || json.detail)
          dispatch(hideOverlay())
        } else {
          toast.success('Password changed successfully')
          dispatch(hideOverlay())
          resetForm()
        }
      }
    },
  })
  const { handleBlur, handleChange, submitForm, values, touched, errors, resetForm } = formik

  return (
    <>
      <section className={styles['settings']}>
        <div className={`container ${styles['container']}`}>
          <div className={styles['settings__content']}>
            <div className={styles['leaves']}></div>
            <div className={styles['top']}>
              <h1>{t('settings.settings')}</h1>
            </div>
            <div className={styles['settings__head']}>
              <div className={styles['wrap']}>
                <div className={styles['avatar']}>
                  <img src={`/img/${userData?.users_level?.slug}-avatar.svg`} alt="" />
                </div>
                <div className={styles['title']}>
                  <h2>
                    <span className={styles['fullName']}>{`${userData?.firstname} ${userData?.lastname}`}</span>
                    <span className={styles['position']}>{`(${userData?.users_job?.title ?? ''})`}</span>
                  </h2>
                  <p>{userData?.email}</p>
                </div>
              </div>
              <p className={styles['status']}>
                <span>{t('settings.status')}</span>
                <span className={styles['statusValue']}>{userData?.active ? "Active" : "Inactive"}</span>
              </p>
            </div>

            <div className={styles['settings__form-wrap']}>
              <h5>{t('settings.password')}</h5>

              <div className={styles['settings__form']}>
                <PassInput
                  id='OldPassword'
                  label={t('settings.oldPassword')}
                  placeholder="**************************"
                  validationError={t('settings.typePassword')}
                  isError={touched.oldPass && !!errors.oldPass}
                  name='oldPass'
                  value={values.oldPass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <PassInput
                  id='NewPassword'
                  label={t('settings.newPassword')}
                  placeholder="**************************"
                  validationError={t('settings.typeNewPassword')}
                  isError={touched.newPass && !!errors.newPass}
                  name='newPass'
                  value={values.newPass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <PassInput
                  id='ConfirmPassword'
                  label={t('settings.confirmPassword')}
                  placeholder="**************************"
                  validationError={t('settings.typeConfirmPassword')}
                  isError={touched.confirmPass && !!errors.confirmPass}
                  name='confirmPass'
                  value={values.confirmPass}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {/* <div className={`field ${styles['field']}`}>
                  <p><span>*</span> <span>Old Password</span></p>
                  <input type="password" id="OldPassword" placeholder="**************************" />
                  <span className={`password-icon old-password-icon active`}></span>
                  <span className={`${styles['let-know']} ${styles['active']}`}>Please type here your password</span>
                </div> */}
                {/* <div className={`field ${styles['field']}`}>
                  <p><span>*</span> <span>New Password</span></p>
                  <input id="NewPassword" type="password" placeholder="**************************" />
                  <span className={`password-icon new-password-icon`}></span>
                  <span className={styles['let-know']}>Please type your password</span>
                </div> */}
                {/* <div className={`field ${styles['field']}`}>
                  <p><span>*</span> <span>Confirm Password</span></p>
                  <input id="ConfirmPassword" type="password" placeholder="**************************" />
                  <span className={`password-icon confirm-password-icon`}></span>
                  <span className={styles['let-know']}>Please type your password</span>
                </div> */}

                <div id="msg-changePassword"></div>
                <div className={styles['bottom']}>
                  <button
                    id="changePassword"
                    className={`btn`}
                    onClick={submitForm}
                  >
                    {t('settings.changePassword')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Language />
    </>
  )
}

export default Settings