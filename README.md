# sanfl
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
To run all tests:

```
npm test
```

To run unit tests:

```bash
npm run unittest
``` 

The test results are presented in the terminal.

## Release
```bash
npm install -g electron-packager
npm run build
electron-packager build --platform=[darwin|linux|mas|win32] --arch=[ia32|x64]
```

