# RealTime Logger
RealTime Logger is used for realtime logging in your application. It can be done in every language, you just need to send a POST request with your JSON object. RealTime Logger was mainly made for PHP language. There is an implementation for PHP - [LoggerX](https://github.com/AlexKratky/LoggerX).

![img](https://i.imgur.com/7QYiX4k.png)



### Installation

Download files from GitHub repository and run following command:

```bash
npm install
```

### Setup

Rename `logger.sample.config.json` to `logger.config.json` and change values to yours.

* `server` - Server name (URL or IP)
* `port` - Port that will be used for app
* `secured` - Should use https or http (`true` = https)
* `password` - Password that will be used when logging data using POST method - You should generate some strong password, e.g. 64 characters
* `privateKey` - Path to private key - used when the app is `secured`
* `certificate` - Path to certificate - used when the app is `secured`
* `log` - If sets to true, app will log all data to .log file

### Usage

Run app using:

```bash
nodejs realtime-logger.js
```

After that, the app will log to console the URL, where you can all the logs, for example:

```bash
[INFO][2020-04-18 09:06:46] Server running on: https://panx.dev:8000
```

So all you need to do is open a tab in your browser with that URL (e.g. `https://panx.dev:8000`).

## With ❤️ by

- Alex Kratky
- E-mail: [alex@panx.dev](mailto:alex@panx.dev)
- Web: https://alexkratky.com/

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AlexKratky/realtime-logger/blob/master/LICENSE) file for details