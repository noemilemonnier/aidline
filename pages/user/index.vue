<template>
    <div>
        <v-container>
            <h1 class="text-center">Welcome <span class="primary--text">{{ $store.state.user_name }} </span> to the User Panel!</h1>
            <v-divider></v-divider>
            <p class="text-center">In this panel, you can access send a request, check the status of you request, and your settings.<v-icon class="spin">{{ i.mdiCog }}</v-icon></p>
        </v-container>

		<v-container>
            <v-row justify="center">
                <v-col cols="10">
                    <v-row justify="center">
                        <v-col cols="12" md="6" lg="4">
                            <v-card id="card" elevation="3" class="accent d-flex align-center"  height="130" nuxt link to="/user/sendrequest">
                                <div class="display-2 flex-grow-1 text-center white--text">Send Request</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-card id="card" elevation="3" class="accent d-flex align-center"  height="130" nuxt link to="/user/currentrequest">
                                <div class="display-2 flex-grow-1 text-center white--text">Current Request</div>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="6" lg="4">
                            <v-card id="card" elevation="3" class="accent d-flex align-center"  height="130" nuxt link to="/user/settings">
                                <div class="display-2 flex-grow-1 text-center white--text">Settings</div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
		</v-container>
    </div>
</template>

<script>
import { mdiCog } from "@mdi/js";

export default {
    layout: "admin",
    middleware: 'user',
	head: () => ({
        title: "User Panel"
    }),
    data: () => ({
        i: {
            mdiCog
        },
    }),
}
</script>

<style scoped>
#card{
    border-radius:30px;
}
@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}

.spin {
  animation-name: spin;
  animation-duration: 4000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
