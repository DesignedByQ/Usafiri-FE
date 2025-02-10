# Usafiri-FE
Front end for all UI of Usafiri web application

This Micro service is designed to manage user login and sign up attempts. After successful sign up and login, users will be navoigated to the user dashboard where that can access other features of the platform.

Sign up process:

    - Users enter their email, phone number, DOB and password.
    - An OTP is sent to the users email of which they submit.
    - After the email OTP has been confirmed, a second OTP is sent to the users phone number to do the same.
    - Once both the OTP's have been confirmed, the user will be directed to the user dashboard screen.

Login process:

    - Users enter their email and phone number.
    - An OTP is sent to the users phone of which they submit.
    - Once the OTP has been confirmed, the user will be directed to the user dashboard screen.

All credentials entered are verified for correct formatting along with validating the age of the user. Any fields that are incorrect when submitted will be highlighted under the relevant button in red. This will prompt the user to make any corrections needed before trying again.


