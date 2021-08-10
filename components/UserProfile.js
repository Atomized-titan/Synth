/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { BsPencilSquare } from 'react-icons/bs';
import { IconContext } from "react-icons";

const UserProfile = ({ user }) => {
    return (
        <div className="box-center">
            <img src={user.photoURL || '/hacker.png'} className="card-img-center" />
            <p>
                <i>@{user.username}</i>
            </p>
            <IconContext.Provider value={{className: "global-class-name", size: "1.8em" }}>
                <h1>{user.displayName}<a href="#" className="edit-pencil"><BsPencilSquare /></a></h1>
            </IconContext.Provider>

        </div>
    );
}

export default UserProfile;

// Key  	    Default	Notes
// color	    undefined (inherit)	
// size	        1em	
// className	undefined	
// style	    undefined	        Can overwrite size and color
// attr	        undefined	        Overwritten by other attributes
// title	    undefined	        Icon description for accessibility