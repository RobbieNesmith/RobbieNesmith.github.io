function init() {
    let errors = [];
    const usp = new URLSearchParams(top.location.search);
    const returnUrl = usp.get("returnUrl");
    const serviceName = usp.get("serviceName");

    if (!returnUrl) {
        errrors.push("You must supply a return URL");
    }
    if (!serviceName) {
        errors.push("You must supply a service name");
    }

    if (errors.length) {
        const errorContainerEl = document.getElementById("error");
        const errorListEl = document.getElementById("errorList");
        for (let error of errors) {
            const errorEl = document.createElement("li");
            errorEl.innerText = error;
            errorListEl.appendChild(errorEl);
        }
        errorContainerEl.classList.remove("hidden");
    } else {
        const signUpEl = document.getElementById("signup");
        const serviceNameEl = document.getElementById("serviceName");
        const signupFormEl = document.getElementById("signupForm");
        signupFormEl.action = returnUrl;
        serviceNameEl.innerText = serviceName;
        signUpEl.classList.remove("hidden");
    }
}