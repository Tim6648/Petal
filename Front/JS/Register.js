

window.onload = function () {
    const UserNameDom = document.getElementsByClassName("UserName")[0];
    const AcCountDom = document.getElementsByClassName('Account')[0];
    const PassWordDom = document.getElementsByClassName("PassWord")[0];
    const RegisterButtonDom = document.getElementsByClassName("RegisterButton")[0];
    const PopUp_ContainerDom = document.getElementsByClassName('PopUp_Container')[0];

    const init = () => {
        BindEvent();
    }

    const BindEvent = () => {
        RegisterButtonDom.addEventListener("click", RegisterClickFun)
    }

    function RegisterClickFun() {
        let UserNameValue = UserNameDom.value;
        let AcCountValue = AcCountDom.value;
        let PassWordValue = PassWordDom.value;
        if (UserNameValue.length != 0 && AcCountValue.length != 0 && PassWordValue.length != 0) {
            let UserRegisterObj = {
                AcCount:AcCountValue,
                UserName:UserNameValue,
                PassWord:PassWordValue
            }
            axios.get("http://127.0.0.1:3000/Api/Register",
                {
                    params:UserRegisterObj
                }
            ).then(
                response => {
                    let data = response.data
                    PopUp_ContainerDom.children[0].textContent = data.msg;      
                    PopUp_ContainerDom.style.top = 70 + "px"
                    setTimeout(() => {
                        PopUp_ContainerDom.style.top = -70 + "px"
                        if(data.msg == "注册成功"){
                            location.href = "../Front/Login.html"
                        }
                    }, 2000);
                }
            )

        }else{
            PopUp_ContainerDom.children[0].textContent = "输入不能为空";      
            PopUp_ContainerDom.style.top = 70 + "px"
            setTimeout(() => {
                PopUp_ContainerDom.style.top = -70 + "px"
            }, 2000);
        }
    }



    init();
}