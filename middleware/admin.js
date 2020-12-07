import { roles } from "@/api/types";

export default function ({ store, redirect, error }){
	const accepted = [ roles.ADMIN ];

	if (store.state.user_type === null || store.state.user_type=== roles.USER || store.state.user_type=== roles.DRIVER ) {
		return redirect('/login')
	}

	

	if ( !accepted ){
		return error({
			message: "Not authorized!",
			statusCode: 403
		});
	}
}