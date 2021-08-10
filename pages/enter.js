/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import firebase from "firebase/app";
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';
import Metatags from '../components/Metatags';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF,faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons'
library.add(faFacebookF, faGoogle, faLinkedin);




import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';

export default function Enter(props) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      <Metatags title="Enter" description="Sign up for this amazing app!" />
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <>
      {/* <button className="btn-google" onClick={signInWithGoogle}>
        <img src={'/google.png'} width="30px" /> Sign in with Google
      </button> */}
      <button className="anonymous" onClick={async () => await auth.signInAnonymously()}>
        Sign in Anonymously
      </button>

      <div className="container sign-container" id="container">
        <div className="form-container sign-up-container">
          <form className="sign-form" action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              {/* <a href="#" className="social"><i className="fab fa-facebook-f"></i></a> */}
              <a href="#" className="social" onClick={signInWithGoogle}><FontAwesomeIcon icon={['fab', 'google']} /></a>
              {/* <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a> */}
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" id="txtName"/>
            <input type="email" placeholder="Email" id="txtEmailUp" />
            <input type="password" placeholder="Password" id="txtPasswordUp" />
            <button onClick={() => {
              // Get email and password
              const txtEmail = document.getElementById('txtEmailUp')
              console.log(txtEmail);
              const txtPassword = document.getElementById('txtPasswordUp')
              const email = txtEmail.value.trim();;
              const pass = txtPassword.value.trim();;
              // Sign in
              const promise = auth.createUserWithEmailAndPassword(email,pass);
              promise
              // .then(user => console.log(user))
              .catch((e) => {
                console.log(e.message);
              })

              firebase.auth().onAuthStateChanged(firebaseUser => {
                if(firebaseUser){
                  console.log(firebaseUser);
                }
                else{
                  console.log('Not logged in')
                }
              })

              
            }}>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form className="sign-form" action="#">
            <h1>Sign in</h1>
            <div className="social-container">
              {/* <a href="#" className="social"><FontAwesomeIcon icon={['fab', 'facebook-f']} /></a> */}
              <a href="#" className="social" onClick={signInWithGoogle}><FontAwesomeIcon icon={['fab', 'google']} /></a>
              {/* <a href="#" className="social"><FontAwesomeIcon icon={['fab', 'linkedin']} /></a> */}
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email" id="txtEmail"/>
            <input type="password" placeholder="Password" id="txtPassword" />
            <a href="#">Forgot your password?</a>
            <button onClick={() => {
              // Get email and password
              const txtEmail = document.getElementById('txtEmail')
              console.log(txtEmail);
              const txtPassword = document.getElementById('txtPassword')
              const email = txtEmail.value.trim();;
              const pass = txtPassword.value.trim();;
              // Sign in
              const promise = auth.signInWithEmailAndPassword(email,pass);
              promise.catch((e) => {
                console.log(e.message);
              })

              
            }}>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn"  onClick={() => {
              const container = document.getElementById('container');
              container.classList.remove("right-panel-active");
            }}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={() => {
              const container = document.getElementById('container');
              container.classList.add("right-panel-active");
            }}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      {/* <footer>
        <p>
          Created with <i className="fa fa-heart"></i> by
          <a target="_blank" href="https://florin-pop.com">Florin Pop</a>
          - Read how I created this and how you can join the challenge
          <a target="_blank" href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
        </p>
      </footer> */}
    </>
  );
}



// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName});
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log('Firestore read executed!');
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form  onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}