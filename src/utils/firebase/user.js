import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import axios from "axios";

import { clearUser } from "../../redux/reducers/user/user.actions";

import Config from "../../config";

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogleProvider = async () => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    const { uid, displayName, email } = response.user;
    return { uid, fullName: displayName, email };
  } catch ({ message }) {
    if (message.includes("auth/popup-closed-by-user")) return null;

    throw Error("Something went wrong. Please try again in a moment.");
  }
};

export const loginToFirebase = async (userCredentials) => {
  const { email, password } = userCredentials;
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    const {
      user: { displayName, uid },
    } = response;
    return { email, fullName: displayName, uid };
  } catch ({ message }) {
    if (
      message.includes("auth/wrong-password") ||
      message.includes("auth/user-not-found")
    ) {
      throw new Error("Email or password is incorrect.");
    }
    throw Error("Something went wrong. Please try again in a moment.");
  }
};

export const registerToFirebase = async (userCredentials) => {
  const { email, password, fullName } = userCredentials;

  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    updateProfile(auth.currentUser, {
      displayName: fullName,
    });
    const {
      user: { uid },
    } = user;
    return { fullName, email, uid };
  } catch (error) {
    const { message } = error;
    if (message.includes("auth/invalid-email")) {
      throw Error("Invalid email structure.");
    } else if (message.includes("auth/email-already-in-use")) {
      throw Error("Email already exists.");
    } else {
      throw Error("Something went wrong. Please try again in a moment.");
    }
  }
};

export const changeUserPhoneNumber = async (phoneNumber) => {
  const user = auth.currentUser;
  try {
    axios.post(`${Config.FirebaseEndPoint}/changePhoneNumber`, {
      uid: user.uid,
      phoneNumber,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const changeUserPassword = async (userCredentials) => {
  const { currentPassword, newPassword } = userCredentials;
  const user = auth.currentUser;
  const authCredentials = EmailAuthProvider.credential(
    user.email,
    currentPassword
  );
  await reauthenticateWithCredential(user, authCredentials)
    .then(() => {
      axios
        .post(
          `${Config.FirebaseEndPoint}/changePassword`,
          {
            uid: user.uid,
            password: newPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("labas");
        })
        .catch((err) => {
          throw new Error("Cannot change password to the new one.");
        });
    })
    .catch((err) => {
      throw new Error("Incorrect old password");
    });
};

export const signOutUser = (dispatch) => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      dispatch(clearUser());
      console.log("SignOut successfully!");
    })
    .catch((error) => {
      // An error happened.
    });
};
