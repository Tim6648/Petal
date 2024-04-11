window.onload = () => {
    const UserNameDom = document.getElementsByClassName("UserName")[0];
    const User_IdDom = document.getElementsByClassName("User_Id")[0];

    const LoginButtonDom = document.getElementsByClassName("LoginButton")[0];
    const RegisterButtonDom = document.getElementsByClassName("RegisterButton")[0];
    const UploadImageButtonDom = document.getElementsByClassName("UploadImageButton")[0];


    let PopUpStata = false

    const init = () => {
        if (sessionStorage.getItem("Token")) {
            const UserToken = sessionStorage.getItem("Token");
            GetUserInfoFun(UserToken)

        } else {

        }
        GetPhotoAllImagesFun()


        BindEvent();
    }

    const BindEvent = () => {
        LoginButtonDom.addEventListener("click", function () {
            location.href = "../Login.html";
        })
        RegisterButtonDom.addEventListener("click", function () {
            location.href = "../Register.html"
        })
        UploadImageButtonDom.addEventListener("click", UserUpLoadImageFun);

        $(".PopUp_Container")[0].addEventListener("click", function (e) {
            let IsInput = e.target.tagName == "INPUT" ? true : false;
            let IsI = e.target.tagName == "I" ? true : false;
            if (IsInput || IsI) {

            } else {
                let Element = e.currentTarget
                Element.style.opacity = 0;
                setTimeout(() => {
                    Element.style.display = "none";
                    PopUpStata = false;
                }, 1000);
            }

        })
    }

    function GetUserInfoFun(UserToken) {
        let UserNowToken = UserToken;
        axios.get("http://127.0.0.1:3000/Api/SearchUserInfo", {
            headers: {
                "authorization": UserNowToken
            }
        }).then(
            response => {
                let data = response.data.msg;
                UserNameDom.textContent = data.UserName;
                User_IdDom.textContent = data._id
            }
        )
    }

    function UserUpLoadImageFun(e) {

        if (sessionStorage.getItem("Token")) {
            $(".UploadAnImage_Container")[0].style.display = "block"
            const uploadButtonDom = document.getElementById("uploadButton");
            const UploadFileInputDom = document.getElementById("UploadFileInput");
            const textareaInputDom = document.getElementById('textareaInput');
            const RedayButton_ContainerDom = document.getElementsByClassName("RedayButton_Container")[0];

            uploadButtonDom.addEventListener("click", function () {
                UploadFileInput.click();
            })
            UploadFileInputDom.addEventListener("change",
                async function (e) {
                    const formData = new FormData();
                    formData.append("file", e.target.files[0])
                    axios.post("http://127.0.0.1:3000/Api/PutFileImages", formData, {
                        header: {
                            "Content-Type": "multipart/form-data"
                        }
                    }).then(
                        response => {
                            let Img_Url = response.data.Img_Url

                            $(".Upload_Left_Container").empty();
                            $(".Upload_Left_Container").append(`
                            <img src=${Img_Url} />
                        `)

                        }
                    )
                }
            )
            RedayButton_ContainerDom.onclick = function (e) {
                if (textareaInputDom.value.length != 0) {
                    let IsDiv = document.getElementsByClassName('Upload_Left_Container')[0].children[0].tagName == "DIV" ? true : false;
                    if (IsDiv) {
                        alert("You haven't uploaded an image yet")
                    } else {
                        let ImageUrl = document.getElementsByClassName('Upload_Left_Container')[0].children[0].src;
                        let UserNowToken = sessionStorage.getItem("Token")
                        axios.get("http://127.0.0.1:3000/Api/SearchUserInfo", {
                            headers: {
                                "authorization": UserNowToken
                            }
                        }).then(
                            response => {
                                let data = response.data.msg;
                                let UserUploadObj = {
                                    User_Id:data._id,
                                    UserName:data.UserName,
                                    ImagesUrl:ImageUrl,
                                    Script:textareaInputDom.value,
                                    Star:0
                                }
                                axios.get("http://127.0.0.1:3000/Api/UploadData",{
                                    params:UserUploadObj
                                }).then(
                                    res => {
                                        alert(res.data.msg)
                                        $(".UploadAnImage_Container")[0].style.display = "none";
                                        GetPhotoAllImagesFun()
                                        textareaInputDom.value = "";
                                        $(".Upload_Left_Container").empty();
                                        $(".Upload_Left_Container").append(`
                                        <div class="Add_Icon_Container">
                                            <input id="UploadFileInput" type="file">
                                            <i id="uploadButton" class="iconfont icon-jiahao"></i>
                                        </div>
                                        `)
                                    }
                                )
                                
                            }
                        )
          
                    }
                    // console.log(GetImageSrc)
                } else {
                    alert('The input cannot be empty')
                }
            }
        } else {
            alert("Please log in first")
        }
    }

    function GetPhotoAllImagesFun() {
        axios.get("http://127.0.0.1:3000/Api/GetPhotoAllImages", {

        }).then(
            response => {
                let data = response.data.data;
                sessionStorage.setItem("data", JSON.stringify(data))
                $(".Right_Container").empty();
                for (let i = 0; i < data.length; i++) {
                    let NowData = data[i];
                    $(".Right_Container").append(`
                    <div _id=${NowData._id} class="Images_Container">
                        <img  src=${NowData.ImagesUrl} />
                        <div class="Script">${NowData.Script}</div>
                        <div class="UploadUserName">${NowData.UserName} <i class="iconfont icon-star"><span>${NowData.Star}</span></i></div> 
                    </div>
                    `)
                }
                if (sessionStorage.getItem("Token")) {
                    GetUserLikeListFun()
                }
                $(".Right_Container > .Images_Container").on("click", function (e) {
                    if (!PopUpStata) {
                        const element = e.currentTarget;
                        const element_id = element.getAttribute("_id");
                        for (let j = 0; j < data.length; j++) {
                            if (data[j]._id == element_id) {

                                let RedayData = data[j];
                                $(".PopUp_Container")[0].setAttribute("_id", data[j]._id)
                                $(".PopUp_Container").empty();
                                $(".PopUp_Container").append(`
                                <div class="PopUp_Left">
                                    <img src=${RedayData.ImagesUrl} alt="">
                                </div>            
                                <div class="PopUp_Right">
                                    <div class="Delite_UserName">${RedayData.UserName}</div>
                                    <div class="Delite_Script">${RedayData.Script}</div>
                                    <div class="Comments_Container">
                                      <div class="CommentsNumber">
                                        ${RedayData.Commect.length} total reviews
                                      </div>
                                    </div>
                                    <div class="Control_Container" _id=${RedayData._id}>
                                        <div class="Control_Left_Container">
                                            <input class='ControlInput' placeholder=${sessionStorage.getItem("Token") != undefined ? "Go_to_the_comments put" : "Please_log_in"} />
                                        </div>
                                        <div class="Control_Right_Container">
                                        <i class="iconfont icon-star isLike"><span>${RedayData.Star}</span></i>
                                        </div>
                                    </div>
                                </div> 
                                `)
                                $(".Comments_Container").empty();
                                $(".Comments_Container").append(`
                                    <div class="CommentsNumber">
                                        ${RedayData.Commect.length} total reviews
                                    </div>
                                `)
                                for (let i = 0; i < RedayData.Commect.length; i++) {
                                    $('.Comments_Container').append(`
                                    <div class="Commets_Delite_Container">
                                        <div class="TitleUser_Name">${RedayData.Commect[i].Comment_UserName}</div>
                                        <div class="TitleUser_Comments">${RedayData.Commect[i].Comment_Text}</div>
                                        <div class="TitleUser_Date">${RedayData.Commect[i].Commect_Date}</div>
                                    </div>
                                    `)
                                }

                                ControlBindEvent()
                                if (sessionStorage.getItem("Token")) {
                                    Delete_IdLike()
                                }

                            }
                        }
                        $(".PopUp_Container")[0].style.display = "block";
                        setTimeout(() => {
                            $(".PopUp_Container")[0].style.opacity = 1
                            PopUpStata = true;
                        }, 100);
                    } else {

                        $(".PopUp_Container")[0].click();

                    }

                })

            }
        )
    }

    function Delete_IdLike() {
        let Delete_Id = $(".Control_Container")[0].getAttribute("_id");
        let UserLikeListArr = JSON.parse(sessionStorage.getItem("UserLikeListArr"));
        for (let i = 0; i < UserLikeListArr.length; i++) {
            if (UserLikeListArr[i]._id == Delete_Id) {
                $(".Control_Container").find("i")[0].style.color = "red"
            }
        }
    }
    function ControlBindEvent() {
        const ControlInputDom = document.getElementsByClassName("ControlInput")[0];
        const isLikeDom = document.getElementsByClassName("isLike")[0];
        ControlInputDom.addEventListener("click", function (e) {

            if (sessionStorage.getItem("Token")) {
                e.target.onkeydown = (KeyDownEvent) => {
                    if (KeyDownEvent.key === "Enter") {
                        let UserNowToken = sessionStorage.getItem("Token");
                        axios.get("http://127.0.0.1:3000/Api/SearchUserInfo", {
                            headers: {
                                "authorization": UserNowToken
                            }
                        }).then(
                            response => {
                                let data = response.data.msg;
                                const Opus_id = $(".Control_Container")[0].getAttribute("_id");
                                let UserCommentsValue = e.target.value;
                                let UserCommentObj = {
                                    Comment_UserName: data.UserName,
                                    Comment_id: data._id,
                                    Comment_Text: UserCommentsValue,
                                    Opus_id
                                }
                                axios.get("http://127.0.0.1:3000/Api/UserSendComments", {
                                    params: UserCommentObj
                                }).then(
                                    response => {
                                        alert(response.data.msg)
                                        GetPhotoAllImagesFun()
                                        axios.get("http://127.0.0.1:3000/Api/GetPhotoAllImages").then(
                                            response => {
                                                let data = response.data.data;
                                                let PenddingRenderId = $(".PopUp_Container")[0].getAttribute("_id");


                                                for (let i = 0; i < data.length; i++) {
                                                    if (data[i]._id == PenddingRenderId) {
                                                        let RenderData = data[i]
                                                        $(".Comments_Container").empty();
                                                        $(".Comments_Container").append(`
                                                            <div class="CommentsNumber">
                                                                ${RenderData.Commect.length} total reviews
                                                            </div>
                                                        `)
                                                        for (let i = 0; i < RenderData.Commect.length; i++) {
                                                            $('.Comments_Container').append(`
                                                            <div class="Commets_Delite_Container">
                                                                <div class="TitleUser_Name">${RenderData.Commect[i].Comment_UserName}</div>
                                                                <div class="TitleUser_Comments">${RenderData.Commect[i].Comment_Text}</div>
                                                                <div class="TitleUser_Date">${RenderData.Commect[i].Commect_Date}0</div>
                                                            </div>
                                                            `)
                                                        }
                                                    }
                                                }
                                                $(".Comments_Container").scrollTop($(".Comments_Container")[0].scrollHeight)
                                            }
                                        )
                                    }
                                )
                            }
                        )

                    }
                }
            } else {
                let t = confirm("The current status is not logged in, whether to log in?")
                if (t) {
                    location.href = "../Login.html"
                } else {
                    e.target.blur()
                }
            }
        })
        isLikeDom.addEventListener("click", function () {
            if (sessionStorage.getItem("Token")) {
                let UserThumbsUpObj = {
                    Opus_id: $(".PopUp_Container")[0].getAttribute("_id"),

                }
                let UserNowToken = sessionStorage.getItem("Token");
                axios.get("http://127.0.0.1:3000/Api/ThumbsUp",
                    {
                        headers: {
                            "authorization": UserNowToken
                        },
                        params: UserThumbsUpObj

                    }
                ).then(
                    response => {
                        alert(response.data.msg)
                        if (response.data.msg == "Like success") {
                            $(".Control_Container").find("i")[0].style.color = "red"
                        } else if (response.data.msg == "The cancellation of the like is successful") {
                            $(".Control_Container").find("i")[0].style.color = "white"
                        }

                        GetPhotoAllImagesFun()
                        GetUserLikeListFun()
                        // $(".Control_Container").empty();
                        setTimeout(() => {
                            let Opus_id = $(".PopUp_Container")[0].getAttribute("_id");
                            let data = JSON.parse(sessionStorage.getItem("data"))
                            console.log(Opus_id)
                            console.log(data)
                            for (let i = 0; i < data.length; i++) {
                                if (data[i]._id == Opus_id) {
                                    let NowData = data[i];
                                    let Star = NowData.Star;
                                    $(".isLike > span")[0].textContent = Star
                                }
                            }
                        }, 100);
                    }
                )
            } else {
                let t = confirm("If you are not logged in, do you want to log in?")
                if (t) {
                    location.href = "../Login.html"
                }
            }
        })
    }

    function GetUserLikeListFun() {
        let UserNowToken = sessionStorage.getItem("Token")
        axios("http://127.0.0.1:3000/Api/GetUserLikeList", {
            headers: {
                "authorization": UserNowToken
            }
        }).then(
            response => {
                let UserLikeListArr = response.data.data
                for (let i = 0; i < UserLikeListArr.length; i++) {
                    let Images_ContainerArr = $(".Images_Container");
                    for (let j = 0; j < Images_ContainerArr.length; j++) {
                        let DivId = Images_ContainerArr[j].getAttribute("_id")
                        if (DivId == UserLikeListArr[i]._id) {
                            let ChangeI = $(Images_ContainerArr[j]).find("i")[0];
                            ChangeI.style.color = "red"
                        }
                    }

                }

                sessionStorage.setItem("UserLikeListArr", JSON.stringify(UserLikeListArr))
            }
        )
    }






    init();
}