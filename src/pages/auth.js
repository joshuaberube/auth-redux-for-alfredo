import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AuthInput from '../components/AuthInput'
import { selectIsNewUser, changeIsNewUser, login } from '../redux/slices/userSlice'

const Auth = () => {
  const isNewUser = useSelector(selectIsNewUser)
  const dispatch = useDispatch()

  const [authState, setAuthState] = useState({
    username: '',
    email: '',
    password: ''
  })

  const inputsArr = [
    { label: 'Username', type: 'text', name: 'username', placeholder: 'billyBob9' },
    { label: 'Email', type: 'email', placeholder: 'yourEmail@email.com' },
    { label: 'Password', type: 'password' }
  ]
  
  const inputsToMap = isNewUser ? inputsArr : inputsArr.splice(1, 2)

  const toggleIsNewUser = () => dispatch(changeIsNewUser())

  const onSubmitHandler = e => {
    e.preventDefault()
    dispatch(login(authState))
  }

  return (
    <fieldset>
      <legend>Auth</legend>
      <form onSubmit={onSubmitHandler}>
        {inputsToMap.map(inputData => (
          <AuthInput
            key={`authInput:${inputData.type}`}
            inputData={inputData} 
            authState={authState}
            setAuthState={setAuthState}
          />
        ))}
        <div>
          <input 
            type="button"
            value={isNewUser ? 'Already have an account?' : 'Need an account?'} 
            onClick={toggleIsNewUser} 
          />
          <button type="submit">{isNewUser ? 'Signup' : 'Login'}</button>
        </div>
      </form>
    </fieldset>
  )
}

export default Auth