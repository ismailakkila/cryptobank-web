# CryptoBank Web
CryptoBank is a fictional banking app intended to showcase [Cisco Webex Teams](https://www.webex.com/team-collaboration.html) cloud collaboration features with integrated client chat, voice and video. This is the web frontend application that will connect to the [CryptoBank backend service](https://github.com/ismailakkila/cryptobank-backend).

The app is designed to integrate with Project Onboard. Project Onboard is an experimental web application that allows you to create, view, modify and delete user information via an administration portal. You can check it out [here](https://github.com/ismailakkila/projectonboard).

[Demo](https://cryptobank-web.herokuapp.com)

## Screenshots
Homepage
![Alt text](/screenshots/screenshot-homepage.png?raw=true "Homepage")

Webex Teams Support
![Alt text](/screenshots/screenshot-webexTeamsLoading.png?raw=true "Webex Teams Support")

Voice Chat
![Alt text](/screenshots/screenshot-voicechat.png?raw=true "Voice Chat")

Video Chat - Fullscreen
![Alt text](/screenshots/screenshot-videochatfullscreen.png?raw=true "Video Chat - Fullscreen")

Video Chat - Window
![Alt text](/screenshots/screenshot-videochatwindow.png?raw=true "Video Chat - Window")

## Prerequisites
You will need to setup the following:
* [Project Onboard](https://github.com/ismailakkila/projectonboard)
* [CryptoBank Backend](https://github.com/ismailakkila/cryptobank-backend)
* [Cisco Webex Teams Developer Account](https://developer.webex.com)

Modify src/backendUrl.js to specify your CryptoBank Backend URL.

Create a .env file in the root folder with the following parameters:
```
PORT=<Your Web Server Port>
```

## Installation
Install the application
```
npm install
```
Start the application
```
npm start
```

## Built With
* [Express Node.js](https://expressjs.com)
* [Socket.IO](https://socket.io)
* [Cisco Webex](https://developer.webex.com)
* [React](https://reactjs.org)
* [Redux](https://redux.js.org)
* [Semantic-UI](https://semantic-ui.com)
