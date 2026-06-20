class MailClient {
    constructor() {
        this.subjectInput = document.getElementById("mail-subject");
        this.messageInput = document.getElementById("mail-message");
        this.senderInput = document.getElementById("mail-sender");
        this.sendButton = document.getElementById("send-mail");
        this.charCounter = document.getElementById("mail-char-counter");

        this.maxChars = 2500;
        this.apiUrl =
            "https://script.google.com/macros/s/AKfycbzt5J31VrUxqRiPpV0JB4rIdiyO-iw9UtmMj1pk7Vmrl6bumMNUDSX2Yi0e7Evq7GeHdw/exec";

        this.init();
    }

    init() {
        this.messageInput.addEventListener("input", () =>
            this.handleMessageInput(),
        );
        this.subjectInput.addEventListener("input", () =>
            this.removeBorder(this.subjectInput),
        );
        this.senderInput.addEventListener("input", () =>
            this.removeBorder(this.senderInput),
        );

        this.sendButton.addEventListener("click", () => this.sendMail());

        this.countChars();
    }

    handleMessageInput() {
        this.removeBorder(this.messageInput);
        this.countChars();
    }

    countChars() {
        let chars = this.messageInput.value.length;
        let left = this.maxChars - chars;
        this.charCounter.innerText = left + " characters left";

        if (left <= 50) {
            this.charCounter.style.color = "#B9585D";
        } else {
            this.charCounter.style.color = "rgb(160, 158, 164)";
        }
    }

    removeBorder(element) {
        element.style.setProperty("border", "1px solid transparent");
    }

    addError(element) {
        element.style.setProperty("border", "1px solid #FF2C2C");
    }

    validate() {
        let isValid = true;
        let subject = this.subjectInput.value;
        let message = this.messageInput.value;
        let sender = this.senderInput.value;

        if (subject === "") {
            this.addError(this.subjectInput);
            isValid = false;
        }

        if (message === "") {
            this.addError(this.messageInput);
            isValid = false;
        }

        const emailRegex =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!sender.match(emailRegex)) {
            this.addError(this.senderInput);
            isValid = false;
        }

        return isValid;
    }

    sendMail() {
        if (!this.validate()) return;

        let data = JSON.stringify({
            subject: this.subjectInput.value,
            body: this.messageInput.value,
            sender: this.senderInput.value,
        });

        fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: data,
        })
            .then((response) => {
                if (response.ok) {
                    this.showSuccess();
                } else {
                    this.showError();
                }
            })
            .catch((error) => {
                console.error("Mail Error:", error);
                this.showError();
            });
    }

    showSuccess() {
        this.subjectInput.value = "";
        this.messageInput.value = "";
        this.countChars();

        this.sendButton.style.setProperty(
            "animation-name",
            "send-mail-success",
        );
        setTimeout(() => {
            this.sendButton.style.setProperty("animation-name", "none");
        }, 2000);
    }

    showError() {
        this.sendButton.style.setProperty(
            "animation-name",
            "send-mail-failure",
        );
        setTimeout(() => {
            this.sendButton.style.setProperty("animation-name", "none");
        }, 2000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const myMailClient = new MailClient();

    const mailWindow = document.getElementById("mail-window");

    document.querySelectorAll(".open-mail").forEach((button) => {
        button.addEventListener("click", () => {
            let zindex = mailWindow.style.zIndex;
            if (!zindex) {
                zindex = window.getComputedStyle(mailWindow).zIndex;
            }

            if (zindex != String(openedwindows.length) || zindex == "0") {
                windowOnTop(mailWindow);
                document.getElementById("terminalinput").focus();
            } else {
                document.querySelector(".close-mail").click();
            }
        });
    });

    document.querySelectorAll(".close-mail").forEach((button) => {
        button.addEventListener("click", (e) => {
            closeWindow(mailWindow);
        });
    });
});
