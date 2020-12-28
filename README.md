<h1 align="center">
  wss2tcp
  <br>
</h1>

<h4 align="center">wss to tcp connection proxy to be used to connect to public Electrum servers</h4>

## Using it
Just establish a connection to the websockets URL and start sending messages.

Example: `localhost:8080/tcp/electrum.blockstream.info/50001/ignore`

## Hosting your own
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Development
This project uses the standards widely known on the javascript community:
```
npm install # Install dependencies
npm run build # Compile typescript code
npm run lint # Lint & format code
npm start # Start the server
```
