<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Aidline</h3>

  <p align="center">
    Master Project Front-End
    <br />
    <a href="https://github.com/noemilemonnier/frontend"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://aidline.herokuapp.com">View Demo</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project
This is the front-end of our master project done by Noemi Lemonnier using NuxtJS/Vuetify. 

### Built With

* [NuxtJS]()
* [Vue]()
* [Vuetify]()



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo
```sh
git clone https://github.com/noemilemonnier/frontend
```
2. Go into the folder
```sh
cd frontend
```
3. Install NPM packages
```sh
npm install @nuxt/vuetify @nuxt/axios @nuxtjs/proxy jsonwebtoken nodemon scriptjs vue-google-places vuelidate bcryptjs vue-browser-geolocation vue2-google-maps @mdi/js vue-analytics vue-place-autocomplete
```
4. Run the project for development
```sh
npm run dev
```


<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.




<!-- ROADMAP -->
## Roadmap

| Status | Role | Route | Note |
| :---: | :--- | --- | --- |
| ✔  | Home Page | `/` | Completed |
| ✔  | Login Page | `/login` | Need to connect to back-end |
| ✔  | Create User Page | `/create` | Need to connect to back-end |
| ✔  | Home Page for Ambulance Drivers once logged in | `/ambulance` | Need to connect to back-end |
|  ✔ | To see current active request | `/ambulance/currentrequest` | Need to connect to back-end |
| ✔  | Display all pending requests | `/ambulance/pendingrequests` | Need to connect to back-end |
| ✔  | Modify driver-user information | `/ambulance/settings` | Need to connect to back-end |
| ✔  | Home Page for User once logged in| `/user` | Need to connect to back-ends |
| ✔  | Display current request | `/user/currentrequest` | Connect to back-end to get coordinates for distance |
| ✔  | Send a request | `/user/sendrequest` | Need to connect to back-end |
| ✔  | Modify user information | `/user/settings` | Need to connect to back-end  |
| ✔  | Home Page for Admin once logged in | `/admin` | Need to connect to back-end for roles |
| ✔  | Display all requests (create, modify, delete) | `/admin/requests` | Need to connect to back-end |
| ✔  | Display all users (create, modify, delete)s  | `/admin/users` | Need to connect to back-end |
| ✔  | Modify admin-user information | `/admin/settings` | Need to connect to back-end |


<!-- FUNCTIONALITIES -->
## Functionalities to add


| Status | Task |  Note |
| :---: | --- | --- |
| ✔  | Google Map API | Add a Map Home Page |
| ✔  | Google Geolocation | Add to Home Page |
| ✔  | Google Places API | Add to Home Page |
| ✔  | Google Autocomplete | Add to Home Page |
| ✔  | Google Map API | Add a Map Ambulance Current Request Page |
| ✔  | Google Analytics API | Add analytics for the website |
| ✔  | Geolocation | Get geolocation from user |
| ✔  | Google Places API | Add Places API to receive list of hospitals near by |
| ✔  | Push notifications | User must receive notification when driver picks up his request |

<!-- LICENSE -->
## License

Distributed under no license.


<!-- CONTACT -->
## Contact

Noemi Lemonnier <noemilemonnier@gmail.com>

Project Link: [https://github.com/noemilemonnier/frontend](https://github.com/noemilemonnier/frontend)
