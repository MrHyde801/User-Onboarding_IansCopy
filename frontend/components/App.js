// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react'
import * as yup from 'yup'
import axios from 'axios'
import { isValid } from 'ipaddr.js'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

const formSchema = yup.object().shape({
  username: yup
    .string().trim()
    .min(3, e.usernameMin)
    .max(20, e.usernameMax)
    .required(e.usernameRequired),
  favLanguage: yup
    .string()
    .oneOf(['javascript','rust'], e.favLanguageOptions)
    .required(e.favLanguageRequired),
  favFood: yup
    .string()
    .oneOf(['pizza','spaghetti','broccoli'], e.favFoodOptions)
    .required(e.favFoodRequired),
  agreement: yup
    .boolean()
    .oneOf([true],e.agreementOptions)
    .required(e.agreementRequired),

})

const initialValues = {username: '', favFood: '', favLanguage: '', agreement: false}
const initialErrors = {username: '', favFood: '', favLanguage: '', agreement: ''}

const urlEndpoint = 'https://webapis.bloomtechdev.com/registration'

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [values, setValues] = useState(initialValues) //tracking the form
  const [errors, setErrors] = useState(initialErrors) //tracking the errors
  const [isEnabled, setIsEnabled] = useState(false) //tracking disable functionality on submit
  const [success, setSuccess] = useState('') //tracking success message
  const [failure, setFailure] = useState('')


  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  useEffect(() => {
  formSchema.isValid(values).then(setIsEnabled)
  },[values])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    
    let {type, checked, name, value} = evt.target
    if(type == "checkbox") value = checked;
    setValues({...values, [name]: value})

    yup.reach(formSchema,name).validate(value)
      .then(() => setErrors({...errors, [name]: ''}))
      .catch((err) => setErrors({...errors, [name]: err.errors[0]}))

  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post(urlEndpoint, values)
      .then(res => {
        setSuccess(res.data.message)
        setFailure('')
        setValues(initialValues)
      })
      .catch(err => {
        setFailure(err.response.data.message)
        setSuccess('')
      })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {success && <h4 className="success">{success}</h4> }
        {failure && <h4 className="error">{failure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input value={values.username} onChange={onChange} id="username" name="username" type="text" placeholder="Type Username" />
         {errors.username && <div className="validation">{errors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" checked={values.favLanguage === 'javascript'} onChange={onChange} />
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" checked={values.favLanguage === 'rust'} onChange={onChange} />
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <div className="validation">{errors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange} value={values.favFood}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errors.favFood && <div className="validation">{errors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange} checked={values.agreement} />
            Agree to our terms
          </label>
          {errors.agreement && <div className="validation">{errors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!isEnabled} />
        </div>
      </form>
    </div>
  )
}
