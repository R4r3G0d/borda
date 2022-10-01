import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage } from '~/utils/session.server';
import prisma from './prisma.server';
import * as bcrypt from 'bcrypt';


// Create an instance of the authenticator, pass a Type, User,  with what
// strategies will return and will store in the session
const authenticator = new Authenticator(sessionStorage, {
    sessionKey: "sessionKey", // keep in sync
    sessionErrorKey: "sessionErrorKey", // keep in sync
});

// Tell the Authenticator to use the form strategy
authenticator.use(
    new FormStrategy(async function ({ form }) {

        // get the data from the form...
        let email = form.get('email');
        let password = form.get('password');

        // do some validation, errors are in the sessionErrorKey
        if (!email || email?.length === 0) throw new AuthorizationError('Bad Credentials: Email is required')
        if (typeof email !== 'string')
            throw new AuthorizationError('Bad Credentials: Email must be a string')

        if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
        if (typeof password !== 'string')
            throw new AuthorizationError('Bad Credentials: Password must be a string')

        // login the user, this could be whatever process you want
        const player = await prisma.player.findUnique({
            where: {
                email: email,
            },
            include: {
                team: {
                    select: {
                        name: true,
                    },
                },
            }
        })

        if (!player) throw new AuthorizationError("Player Not Found");

        const hash = player.password;
        const isCorrectPassword = await bcrypt.compare(password, hash)
        if (!isCorrectPassword) throw new AuthorizationError("Bad Credentials: Incorrect password")

        delete player.password;

        return await Promise.resolve({ ...player });

    }),
);

function validateSignUpInput(email, password, name){

}

function validatePassword(password, hashedPassword){
    return bcrypt.compare(password, hashedPassword);
}

function hashPassword(password) {
    return bcrypt.hash(password, 10);
};

export default authenticator
export {hashPassword, validatePassword, validateSignUpInput}