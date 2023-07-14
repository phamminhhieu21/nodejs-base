import {urlPaths} from "../constants/urlPaths";

export const forgotPasswordHtml = (temporaryPassword, token) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; color: #000000;">
        <div style="margin-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Forgot Password</h1>
            <p style="font-size: 16px; margin-bottom: 10px;">You have requested to reset your password. Please use the temporary password below to login and change your password.</p>
            <p style="font-size: 16px; margin-bottom: 10px;">Temporary password: <span style="font-weight: 600;">${temporaryPassword}</span></p>
        </div>
        <div style="margin-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Or you can reset new password</h1>
            <a style="font-size: 14px; margin-bottom: 10px;" href='${urlPaths.client.RESET_PASSWORD}/${token}'>Click here if you want to reset a new password</a>
        </div>
        <div style="margin-top: 20px;">
            <p style="font-size: 16px; margin-bottom: 10px;">Regards,</p>
            <p style="font-size: 16px; margin-bottom: 10px;">NodeStore Team</p>
        </div>
    </div>
    
    `
}

export const registerMailHtml = (token) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; color: #000000;">
        <div style="margin-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Verify your email</h1>
            <p style="font-size: 16px; margin-bottom: 10px;">Thank you for registering with us. Please click the button below to verify your email.</p>
            <a style="font-size: 14px; margin-bottom: 10px;" href='${urlPaths.server.REGISTER_MAIL}/${token}'>Verify Email</a>
        </div>
        <div style="margin-top: 20px;">
            <p style="font-size: 16px; margin-bottom: 10px;">Regards,</p>
            <p style="font-size: 16px; margin-bottom: 10px;">NodeStore Team</p>
        </div>
    </div>
    
    `
}