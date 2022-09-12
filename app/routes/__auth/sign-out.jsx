import authenticator from "~/utils/auth.server";

export let loader = async ({ request }) => {
    return await authenticator.logout(request, {
        redirectTo: "/",
    });
};