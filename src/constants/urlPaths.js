require('dotenv').config();
export const urlPaths = {
    server: {
        FORGOT_PASSWORD: `${process.env.URL_SERVER}/auth/reset-password`,
        REGISTER_MAIL: `${process.env.URL_SERVER}/auth/register/confirm-mail`
    },
    client: {
        RESET_PASSWORD: `${process.env.URL_CLIENT}/reset-password`,
        REGISTER_MAIL_FAILED: `${process.env.URL_CLIENT}/register/verify/failed`,
        REGISTER_MAIL_SUCCESSFUL: `${process.env.URL_CLIENT}/register/verify/successful`,
        LOGIN_SUCCESSFUL: `${process.env.URL_CLIENT}/login-success/profile`,
    }

}