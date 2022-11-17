import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "../Firebase";

function Dashboard() {
    const [user] = useAuthState(auth);
    return (
        <div>
            <h1>Welcome, {user?.displayName}</h1>
        </div>
    );
}

export default Dashboard