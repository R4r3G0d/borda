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
    new FormStrategy(async ({ form }) => {

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
        })

        if (!player) throw new AuthorizationError("Player Not Found");
        
        const hash = player.password;
        const isCorrectPassword = await bcrypt.compare(password, hash)
        if (!isCorrectPassword) throw new AuthorizationError("Bad Credentials: Incorrect password")

        return await Promise.resolve({ ...player });

        // if (email === 'max@test.com' && password === 'password') {
        //     user = {
        //         name: email,
        //         token: `${password}-${new Date().getTime()}`,
        //     };

        //     // the type of this user must match the type you pass to the Authenticator
        //     // the strategy will automatically inherit the type if you instantiate
        //     // directly inside the `use` method
        //     return await Promise.resolve({ ...user });

        // } else {
        //     // if problem with user throw error AuthorizationError
        //     throw new AuthorizationError("Bad Credentials")
        // }

    }),
);

export default authenticator