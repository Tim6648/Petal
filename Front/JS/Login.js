window.onload = function () {

    const AccountInputDom = document.getElementsByClassName("Account")[0];
    const PassWordInputDom = document.getElementsByClassName("PassWord")[0];
    const LoginButtonDom = document.getElementsByClassName("LoginButton")[0];
    const PopUp_ContainerDom = document.getElementsByClassName('PopUp_Container')[0];

    const Init = () => {
        BindEvent();
    }

    const BindEvent = () => {
        LoginButtonDom.addEventListener("click", UserLoginClickFun)
    }

    function UserLoginClickFun() {
        let AccountInputValue = AccountInputDom.value
        let PassWordInputValue = PassWordInputDom.value;
        if (AccountInputValue.length != 0 && PassWordInputValue.length != 0) {
            let UserLoginInfoObj = {
                AcCount: AccountInputValue,
                PassWord: PassWordInputValue
            }
            axios.get("http://127.0.0.1:3000/Api/Login",
                {
                    params: UserLoginInfoObj
                }
            ).then(
                response => {
                    let data = response.data;
                    PopUp_ContainerDom.children[0].textContent = data.msg;      PopUp_ContainerDom.style.top = 70 + "px"
                    setTimeout(() => {
                        PopUp_ContainerDom.style.top = -70 + "px"
                        if(data.msg == "Login successful"){
                            sessionStorage.setItem("Token",data.token)
                            location.href = "../index.html"
                        }
                    }, 2000);
                }
            )
        } else {
            PopUp_ContainerDom.style.top = 70 + "px"
            setTimeout(() => {
                PopUp_ContainerDom.style.top = -70 + "px"
            }, 2000);
        }
    }

    Init();


}