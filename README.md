# SFS (Sports Fixture Software)

Within this repository is an Angular 2 Electron Typescript application made for plotting randomised sports seasons.

This software was originally developed for the South Australian National Football League (SANFL) in 2016. It has now been released as free and open source software.

Authors:  
Craig Keogh  
Louis Griffith  
Michael Humphris  

## Install
1. If on Windows, update npm. This is needed to fix a bug with electron-rebuild on Windows:  
   `npm install -g npm`
1. Install dependencies:  
   `npm install`

## Run
```bash
npm start
```
_Note: The first build may appear to hang. This is expected, electron-rebuild takes a couple of minutes to run and does not print any output_

### Live Reload
Instead of running `npm start`, run `npm run watch`.
That will build the app and automatically refresh the electron window when files are changed.

## Testing

#### To run all tests:

```
npm test
```

#### To run unit tests:

```bash
npm run unittest
``` 

  The test results are presented in the terminal.

#### To run end-to-end tests:

```bash
npm run end2end
```

The application will load and run tests autonomously. The application will
close and reload multiple times. See [example video](https://serp2016.slack.com/files/cskeogh/F2NSQEUGH/end-to-end-testing-161013.mp4).
The results are presented in the terminal.


## Release
```bash
npm install -g electron-packager
npm run build
electron-packager build --platform=[darwin|linux|mas|win32] --arch=[ia32|x64]
```

