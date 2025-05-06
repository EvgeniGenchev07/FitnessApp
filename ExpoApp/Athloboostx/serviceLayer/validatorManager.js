function ValidateLogin(email, password) {
    let formErrors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        formErrors.email = 'Valid email is required';
    }
    if (!password || !/(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*\S+).{8,50}/.test(password)) {
        formErrors.password = 'Valid password is required';
    }
    return formErrors;
}

function ValidateRegister(email, password, username) {
    let formErrors = ValidateLogin(email, password);
    if (!username) {
        formErrors.username = 'Valid username is required';
    }
    return formErrors;
}

const _ValidateLogin = ValidateLogin;
export {_ValidateLogin as ValidateLogin};

const _ValidateRegister = ValidateRegister;
export {_ValidateRegister as ValidateRegister};
