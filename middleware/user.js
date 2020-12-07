import { roles } from "@/api/types";

export default function ({ store, route, redirect, error }){
	const accepted = [ roles.USER ];

	if (store.state.user_type === null || store.state.user_type=== roles.ADMIN || store.state.user_type=== roles.DRIVER ) {
		return redirect('/login')
	}

	

	if ( !accepted ){
		return error({
			message: "Not authorized!",
			statusCode: 403
		});
	}
}