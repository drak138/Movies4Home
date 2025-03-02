export default function Changes({type}){
    console.log(type)
    return(
        <div className="change">
            <form action="" className="changeForm">
                {
                type=="Change user name"?
                <label htmlFor="userName">New User name
                    <input type="text" id="userName" name="username"/>
                </label>:
                <>
                <label htmlFor="oldPass">Old Password
                <input type="password" id="oldPass" name="oldPass"/>
                </label>
                <label htmlFor="newPass">New Password
                <input type="password" id="newPass" name="password"/>
                </label>
                </>
                }
                <button>{type}</button>
            </form>
        </div>
    )
}