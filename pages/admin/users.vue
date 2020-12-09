<template>
    <div>
    <v-container>
            <h1 class="text-center">Users</h1>
            <v-divider></v-divider>
            <div class="text-center ma-12">
                <!-- Change to isLoading and then set it to false when it is ready to charge the page-->
                <v-progress-circular :size="200" color="primary" indeterminate v-if="isLoading"></v-progress-circular>
            </div>
        </v-container>
        <v-container id="create">
            <v-speed-dial top right open-on-hover direction="left" transition="slide-y-reverse-transition">
                <template v-slot:activator>
                  <v-btn fab color="primary" dark> <v-icon>{{ $i.mdiAccountMultiplePlusOutline }}</v-icon></v-btn>
                </template>
              <v-btn fab color="button" dark @click.stop="toggleUserForm"> <v-icon>{{ $i.mdiFace }}</v-icon> </v-btn>
        <v-btn fab color="warning" dark @click.stop="toggleDriverForm">
            <v-icon>{{ $i.mdiAmbulance }}</v-icon>
        </v-btn>
        <v-btn fab color="info" dark @click.stop="toggleAdminForm">
            <v-icon>{{ $i.mdiFaceAgent }}</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-container>

    <!-- @updated="onUserUpdated" -->
    <user-form :editTarget="editingUser" v-on:close-dialog="closeDialog" v-model="showUserForm" @added="onUserAdded"></user-form>
    <driver-form :editTarget="editingDriver" v-on:close-dialog="closeDialog2" v-model="showDriverForm" @added="onDriverAdded"></driver-form>
    <admin-form :editTarget="editingAdmin" v-on:close-dialog="closeDialog3" v-model="showAdminForm" @added="onAdminAdded"></admin-form>

    <v-container>
      <div v-if="users.length > 0">
        <v-row class="ma-4">
          <v-select v-model="filters.userType" label="Filter by User" :items="typeOpts" item-text="label" item-value="value" align bottom autocomplete></v-select>
          <v-spacer></v-spacer>
          <v-text-field clearable label="Searching..." v-model="filters.search"></v-text-field>
        </v-row>
        <v-card outlined>
          <client-only>
            <v-data-table :headers="tableHeaders" :items="filteredUsers" :search="filters.search" :items-per-page="40">
                <template v-slot:[`item.id`]="{ item }">
                    {{ item.id }}
                </template>

<template v-slot:[`item.first_name`]="{ item }">
     {{ item.first_name }}
</template>

<template v-slot:[`item.last_name`]="{ item }">
     {{ item.last_name }}
</template>

<template v-slot:[`item.user_type_id`]="{ item }">
     {{ item.user_type_id }}
</template>

<template v-slot:[`item.actions`]="{ item }">
    <!--<v-btn color="primary" icon xSmall @click="toggleEditForm(item.id, item.user_type_id)">
        <v-icon>{{ $i.mdiPencil }}</v-icon>
    </v-btn> -->
    <v-btn color="error" icon xSmall @click="deleteUser(item.id)">
        <v-icon>{{ $i.mdiDelete }}</v-icon>
    </v-btn>
</template>
            </v-data-table>
          </client-only>
        </v-card>
      </div>
      <h4 v-if="users.length === 0 && !isLoading">No Users</h4>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { mdiCheckboxBlankOutline } from "@mdi/js";
import AdminForm from "~/components/adminForm";
import UserForm from "~/components/userForm";
import DriverForm from "~/components/driverForm";
const allText = "All";

export default {
    layout: "admin",
    head: () => ({
        title: "Users",
    }),
    components: {
        "admin-form": AdminForm,
        "driver-form": DriverForm,
        "user-form": UserForm
    },
    data: () => ({
        showUserForm: false,
        editingUser: null,
        showDriverForm: false,
        editingDriver: null,
        showAdminForm: false,
        editingAdmin: null,
        isLoading: true,
        users: [],
        allText,
        filterByUserTypes: null,
        dialog: false,
        dialog2: false,
        dialog3: false,
        tableHeaders: [
            { text: "ID", value: "id" },
            { text: "First Name", value: "first_name" },
            { text: "Last Name", value: "last_name" },
            { text: "Email", value: "email", sortable: false },
            { text: "User Type", value: "user_type_id", sortable: false },
            { text: "Actions", value: "actions", align: "center", sortable: false },
        ],
        i: {
            mdiCheckboxBlankOutline,
        },
        filters: {
            userType: allText,
            search: "",
        },
        typeOpts: [
            { label: allText, value: allText },
            { label: "Admin", value: 3 },
            { label: "Driver", value: 2 },
            { label: "User", value: 1 },
        ],
    }),
    async mounted() {
        try {
            axios
                .get("/api/users")
                .then((response) => {
                    this.users = response.data;
                })
                .catch((error) => {
                    console.error("There was an error in retrieving users!", error);
                });
        } catch (err) {
            if (err.response) {
                console.error("Could not fetch users");
            }
        }
        this.isLoading = false;
    },
    computed: {
        formattedUsers() {
            return this.users.map((user) => {
                const u = { ...user };
                return u;
            });
        },
        filteredUsers() {
            return this.formattedUsers.filter((user) => {
                if (this.filters.userType !== allText && user.user_type_id !== this.filters.userType) return false;
                return true;
            });
        },
    },
    methods: {
        closeDialog() {
            this.dialog = false;
        },
        closeDialog2() {
            this.dialog2 = false;
        },
        closeDialog3() {
            this.dialog3 = false;
        },
        async onAdminAdded(user) {
            await this.$store.dispatch("create_admin", {
                email: user.email,
                password: user.password,
                first_name: user.first_name,
                last_name: user.last_name,
                user_type_id: 3,
            });
            this.$router.replace("/admin")
        },
        async onDriverAdded(user) {
            await this.$store.dispatch("create_driver", {
                email: user.email,
                password: user.password,
                first_name: user.first_name,
                last_name: user.last_name,
                user_type_id: 2,
                driver_license_number: user.driver_license_number,
                ambulance_license_plate: user.ambulance_license_plate,
                driver_phone: user.driver_phone,
                type_of_ambulance: user.type_of_ambulance,
                latitude: user.latitude,
                longitude: user.longitude,
                credit_card_number: user.credit_card_number,
                credit_card_cvv: user.credit_card_cvv,
                credit_card_type: user.credit_card_type,
                credit_card_holder_name: user.credit_card_holder_name,
                credit_card_expiry: user.credit_card_expiry,
            });
            this.$router.replace("/admin")
        },
        async onDriverUpdated(updatedUser) {
            await this.$store.dispatch("update_driver", {
                driver_user_id: updatedUser.id,
                email: updatedUser.email,
                password: updatedUser.password,
                first_name: updatedUser.first_name,
                last_name: updatedUserlast_name,
                driver_license_number: updatedUser.driver_license_number,
                ambulance_license_plate: updatedUser.ambulance_license_plate,
                driver_phone: updatedUser.driver_phone,
                latitude: updatedUser.lat,
                longitude: updatedUser.lng,
                type_of_ambulance: updatedUser.type_of_ambulance,
                credit_card_number: updatedUser.card_number,
                credit_card_cvv: updatedUser.card_cvv,
                credit_card_type: updatedUser.card_type,
                credit_card_holder_name: updatedUser.card_holder,
                credit_card_expiry: updatedUser.card_expiry
            });
        },
        async onUserAdded(user) {
            await this.$store.dispatch("create_user", {
                status: false,
                email: user.email,
                password: user.password,
                first_name: user.first_name,
                last_name: user.last_name,
                user_type_id: 1,
                customer_phone: user.customer_phone,
                street_address: user.street_address,
                postal_code: user.postal_code,
                city: user.city,
                age: user.age,
                country: user.country,
                credit_card_number: user.credit_card_number,
                credit_card_cvv: user.credit_card_cvv,
                credit_card_type: user.credit_card_type,
                credit_card_holder_name: user.credit_card_holder_name,
                credit_card_expiry: user.credit_card_expiry,
            });
            this.$router.replace("/admin")
        },
        async onUserUpdated(updatedUser) {
            await this.$store.dispatch("update_user", {
                customer_user_id: updatedUser.id,
                email: updatedUser.email,
                password: updatedUser.password,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                user_type_id: 1,
                customer_phone: updatedUser.customer_phone,
                street_address: updatedUser.street_address,
                postal_code: updatedUser.postal_code,
                city: updatedUser.city,
                age: updatedUser.age,
                country: updatedUser.country,
                credit_card_number: updatedUser.credit_card_number,
                credit_card_cvv: updatedUser.credit_card_cvv,
                credit_card_type: updatedUser.credit_card_type,
                credit_card_holder_name: updatedUser.credit_card_holder_name,
                credit_card_expiry: updatedUser.credit_card_expiry
            });
        },
        async onAdminUpdated(updatedUser) {
            await this.$store.dispatch("update_admin", {
                admin_user_id: updatedUser.id,
                email: updatedUser.email,
                password: updatedUser.password,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
            });
        },
        toggleUserForm() {
            this.editingUser = null;
            this.showUserForm = true;
        },
        toggleDriverForm() {
            this.editingDriver = null;
            this.showDriverForm = true;
        },
        toggleAdminForm() {
            this.editingAdmin = null;
            this.showAdminForm = true;
        },
        toggleEditForm(id, type) {
            if (type === 1) {
                this.toggleEditUserForm(id)
            }
            if (type === 2) {
                this.toggleEditDriverForm(id)
            }
            if (type === 3) {
                this.toggleEditAdminForm(id)
            }
        },
        toggleEditUserForm(id) {
            const user = this.users.find((user) => user.id === id);
            this.editingUser = { ...user };
            this.showUserForm = true;
        },
        toggleEditDriverForm(id) {
            const user = this.users.find((user) => user.id === id);
            this.editingDriver = { ...user };
            this.showDriverForm = true;
        },
        toggleEditAdminForm(id) {
            const user = this.users.find((user) => user.id === id);
            this.editingAdmin = { ...user };
            this.showAdminForm = true;
        },
        async deleteUser(id) {
            //Not working on back-end at the moment
            if (!confirm("Are you sure you want to delete this user?")) return;
            try {
                axios
                    .delete("/api/users/" + id)
                    .then((response) => {
                        //const index = this.users.findIndex((user) => user.id === id);
                        //this.users.splice(index, 1);
                        window.alert(response.data.message);
                    })
                    .catch(err)({});
            } catch (err) {
                console.error("Couldn't delete user");
            }
        },
        clearFilterUserType() {
            this.filterByUserTypes = null;
        },
    }
}
</script>

<style scoped>
#create .v-speed-dial {
    position: absolute;
}

#create .v-btn--floating {
    position: relative;
}
</style>
