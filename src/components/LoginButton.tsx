import { useContext } from "react"
import { UserContext } from "../App"

export const LoginButton = () => {
    const {handleLogin} = useContext(UserContext)
    return <></>
    // return <GoogleLogin
    //     onSuccess={handleLogin}
    //     onError={() => console.log("Error while loggingin.")}
    //     // useOneTap
    // />
}