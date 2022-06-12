# Neuro Query Support API

A Backend API written in NodeJS using Express, Mongoose, JWT Auth and Socket.io to handle the requests made from React frontend. 

## Usage

```bash
npm run start
```

Runs the Express Web Server along with Socket IO server on different ports.

## Endpoints
All the Endpoints of the API are secured by JWT authentication and can only be accessed programatically and not via browser.

- `POST /login` - Accepts {email,password} and once the login is succesful, it returns the JWT access token to the frontend
- `POST /signup` - Creates a user and stores the data into the db
- `GET /tickets` - Fetches all the unattended / unanswered tickets
- `POST /tickets` - Creates a Ticket in the db
- `GET /tickets/:ticketId` - Fetches the particular ticket with that Id

Most other functionalities are handled via React frontend, which can be found [Here](https://github.com/chethancm2001/react-part-) and also [Here](https://github.com/PushpakkumarBH/hackathon-ineuron)

## Screenshots / Relevent images

![Login Page](https://github.com/PushpakkumarBH/hackathon-ineuron/blob/main/Screenshot%202022-06-12%20at%2011.49.46%20AM.png)

![Signup Page](https://github.com/PushpakkumarBH/hackathon-ineuron/blob/main/Screenshot%202022-06-12%20at%2011.50.09%20AM.png)
