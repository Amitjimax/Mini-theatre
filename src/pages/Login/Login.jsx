import React,{ useState} from 'react'
import './Login.css'
import logo from '../../assets/logos.png'

const Login = () => {

const[signState, setSignState]=useState("Sign In")

  return (
    <div className='login'>
      <img src={logo} className='login-logo' alt="" /> 
      <div className="login-form">
        <h1>Sign Up</h1>
        <form>
          {signState==="Sign up"?<input type="text" placeholder='Your Name' />:<></>}
          <input type="email" placeholder='Email' />
          <input type="password" placeholder='Password' />
          <button>{signState}</button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need Help?</p>
          </div>
        </form>
        <div className="form-switch">
          {signState==="Sign In"?
          <p>New to Min Theater? <span onClick={()=>{setSignState("Sign Up")}}>Sigh Up Now </span></p>
          :<p>Already have account? <span onClick={()=>{setSignState("Sign In")}}>Sigh In Now </span></p>
          }
        </div>
        </div>    
    </div>
  )
}

export default Login
