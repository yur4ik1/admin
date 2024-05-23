import Popup from '../../shared/popup/Popup'
import PropTypes from 'prop-types';
import styles from './addTaskPopup.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useClickOutside } from '../../../utils/hooks/global';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { ADD_TASK } from '../../../queries/tasks';
import { hideOverlay, showOverlay } from '../../../store/actions/global';


const AddTaskPopup = ({ open, handleClose, setTasksData }) => {

    const boldRef = useRef()
    const linkRef = useRef()
    const editorRef = useRef()
    const italicRef = useRef()
    const underlineRef = useRef()
    const unorderedListRef = useRef()

    const { t } = useTranslation()

    const [activeButton, setActiveButton] = useState('')
    const [isPriorityOpen, setIsPriorityOpen] = useState(false)
    const [isComplexityOpen, setIsComplexityOpen] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)

    const complexityRef = useClickOutside(() => setIsComplexityOpen(false))
    const priorityRef = useClickOutside(() => setIsPriorityOpen(false))

    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.auth)
    const [addNewTask] = useMutation(ADD_TASK)



    const priorityOptions = [
        {
            value: 1,
            label: t('tasks.lowest')
        },
        {
            value: 2,
            label: t('tasks.low')
        },
        {
            value: 3,
            label: t('tasks.medium')
        },
        {
            value: 4,
            label: t('tasks.high')
        },
        {
            value: 5,
            label: t('tasks.highest')
        }
    ]

    const complexityOptions = [
        {
            value: 30,
            label: t('tasks.easyPeasy')
        },
        {
            value: 60,
            label: t('tasks.easy')
        },
        {
            value: 120,
            label: t('tasks.intermediate')
        },
        {
            value: 240,
            label: t('tasks.difficult')
        },
        {
            value: 480,
            label: t('tasks.ninjable')
        }
    ]

    // ==> Yup - Formik validations <==
    const validationSchema = Yup.object().shape({
        title: Yup.string().trim().required(),
        priority: Yup.string().trim().required(),
        complexity: Yup.string().trim().required(),
    })

    const formik = useFormik({
        initialValues: {
            title: '',
            priority: '',
            complexity: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            const description = editorRef.current.innerHTML
            if (!description || description === '') {
                setDescriptionError(true)
                return
            } else {
                setDescriptionError(false)
            }
            dispatch(showOverlay())
            addNewTask({
                variables: {
                    user_id: userData?.id,
                    bounty: values.complexity,
                    priority: values.priority,
                    title: values.title,
                    text: description
                }
            }).then(() => {
                setTasksData()
                handleCloseAddTask()
                dispatch(hideOverlay())
            }).catch(() => {
                dispatch(hideOverlay())
            })
        },
    })
    const { handleBlur, handleChange, submitForm, setFieldValue, values, touched, errors, resetForm } = formik

    const handleSubmitForm = (e) => {
        const description = editorRef.current.innerHTML

        if (!description || description === '') {
            setDescriptionError(true)
        } else {
            setDescriptionError(false)
        }
        submitForm(e)
    }

    const handleCloseAddTask = () => {
        resetForm()
        editorRef.current.innerHTML = ''
        handleClose()
    }


    useEffect(() => {

        // --Bold
        const bold = boldRef.current
        const boldHandler = () => {
            document.execCommand('bold', false, '')
            setActiveButton('bold')
        }
        bold.addEventListener('click', boldHandler)

        // --Italic
        const italic = italicRef.current
        const italicHandler = () => {
            document.execCommand('italic', false, '')
            setActiveButton('italic')
        }
        italic.addEventListener('click', italicHandler)

        // --Underline
        const underline = underlineRef.current
        const underlineHandler = () => {
            document.execCommand('underline', false, '')
            setActiveButton('underline')
        }
        underline.addEventListener('click', underlineHandler)

        // --Unordered list
        const unorderedList = unorderedListRef.current
        const unorderedListHandler = () => {
            document.execCommand('insertUnorderedList', false, '')
            setActiveButton('ul')
        }
        unorderedList.addEventListener('click', unorderedListHandler)

        // --Link
        const link = linkRef.current
        const linkHandler = () => {
            var url = prompt("Enter the URL");
            if (url) {
                document.execCommand("createLink", false, url)
                setActiveButton('link')
            }
        }
        link.addEventListener('click', linkHandler)

        return () => {
            bold.removeEventListener('click', boldHandler)
            italic.removeEventListener('click', italicHandler)
            underline.removeEventListener('click', underlineHandler)
            unorderedList.removeEventListener('click', unorderedListHandler)
            link.removeEventListener('click', linkHandler)
        }
    }, [])


    return (
        <Popup
            open={open}
            title={'ADD TASK'}
            className={`${styles['in-progress-popup']} ${styles['add-task']}`}
            innerClassName={styles['main__popup-inner']}
            handleClose={handleCloseAddTask}
            contentClassName={styles['main__popup-content']}
        >
            <h5 className={styles['block-name']}>{t('tasks.taskInformation')}</h5>
            <div className={`field ${styles['field']} ${styles['taskInformation']}`}>
                <input
                    type="text"
                    placeholder="Summary"
                    name='title'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                />
                {touched.title && errors.title && <span className={`let-know ${styles['let-know']} active`}>{t('tasks.addSummary')}</span>}
            </div>

            {/* WYSIWYG */}
            <div className={`field ${styles['field']} ${styles['desc__editor-container']}`}>
                <h5 className={styles['block-name']}>{t('tasks.description')}</h5>
                <div className={styles['desc__editor']}>
                    <div className={styles['desc__editor-top']}>
                        <div className={styles['settings-list']}>
                            <button ref={boldRef} className={`${styles['editor-btn']} ${styles['bold-btn']} ${activeButton === 'bold' ? styles['active'] : ''}`}></button>
                            <button ref={italicRef} className={`${styles['editor-btn']} ${styles['italic-btn']}  ${activeButton === 'italic' ? styles['active'] : ''}`}></button>
                            <button ref={underlineRef} className={`${styles['editor-btn']} ${styles['underlined-btn']}  ${activeButton === 'underline' ? styles['active'] : ''}`}></button>
                        </div>
                        <div className={styles['settings-list']}>
                            <button ref={unorderedListRef} className={`${styles['editor-btn']} ${styles['bulleted-btn']}  ${activeButton === 'ul' ? styles['active'] : ''}`}></button>
                        </div>
                        <div className={styles['settings-list']}>
                            <button ref={linkRef} className={`${styles['editor-btn']} ${styles['link-btn']}  ${activeButton === 'link' ? styles['active'] : ''}`}></button>
                        </div>
                    </div>
                    <div
                        className={`editor ${styles['editor']}`}
                        contentEditable="true"
                        ref={editorRef}
                    >
                    </div>
                </div>
                {descriptionError && <span className={`let-know ${styles['let-know']} active`}>{t('tasks.addDescription')}</span>}
            </div>


            <div
                className={`filter-select ${styles['filter-select']} ${styles['add-priority']} ${isPriorityOpen ? styles['active'] : ''}`}
                ref={priorityRef}
            >
                <div className={`select-selected ${styles['select-selected']}`} onClick={() => setIsPriorityOpen(!isPriorityOpen)}>
                    <span className="select-name">{priorityOptions.filter((item) => item.value === Number(values.priority))[0]?.label ?? t('tasks.priority')}</span>
                </div>
                <div
                    className={`select-items ${!isPriorityOpen ? 'select-hide' : ''}`}
                >
                    {
                        priorityOptions.map((priority) => {
                            return (
                                <div className="select-option" key={priority.value}>
                                    <input type="checkbox"
                                        id={priority.value}
                                        value={priority.value}
                                        name='priority'
                                        onChange={(e) => {
                                            setFieldValue('priority', e.target.value)
                                            setIsPriorityOpen(false)
                                        }}
                                        checked={priority.value === Number(values.priority)}
                                    />
                                    <label htmlFor={priority.value}>{priority.label}</label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="field">
                <div className="new__custom-select-wrapper">
                    <div
                        ref={complexityRef}
                        className={`new__custom-select filter-select-scroll ${isComplexityOpen ? 'open' : ''}`}
                    >
                        <div className="arrow"></div>

                        <div className="new__custom-select__trigger" onClick={() => { setIsComplexityOpen(!isComplexityOpen) }}>
                            <span className={styles['complexity-Label']}>{complexityOptions.filter((item) => item.value === Number(values.complexity))[0] ? <>
                                <span>{complexityOptions.filter((item) => item.value === Number(values.complexity))[0]?.value}</span>
                                <img src="/img/coins.svg" alt="coins icon" />
                                <span>{complexityOptions.filter((item) => item.value === Number(values.complexity))[0]?.label}</span>
                            </> :
                                t('tasks.complexity')}</span>
                        </div>

                        <div className="new__custom-options">
                            {
                                complexityOptions.map((complexity) => {
                                    return (
                                        <div className="new__custom-option" key={complexity.value}>
                                            <input
                                                type="checkbox"
                                                id={complexity.value}
                                                value={complexity.value}
                                                name='complexity'
                                                onChange={(e) => {
                                                    setFieldValue('complexity', e.target.value)
                                                    setIsComplexityOpen(false)
                                                }}
                                                checked={complexity.value === Number(values.complexity)}
                                            />
                                            <label htmlFor={complexity.value}>
                                                <span className="custom-option-additional-info">
                                                    <span>{complexity.value}</span>
                                                    <img src="/img/coins.svg" alt="coins icon" />
                                                </span>{complexity.label}
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="custom-scrollbar"></div>
                    </div>
                </div>
            </div>

            <div className={styles['bottom']}>
                <button
                    className={`btn ${styles['add-btn']}`}
                    onClick={handleSubmitForm}
                >
                    {t('tasks.add')}
                </button>
            </div>

        </Popup >
    )
}

AddTaskPopup.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    setTasksData: PropTypes.func
}


export default AddTaskPopup