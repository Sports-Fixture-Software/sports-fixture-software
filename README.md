# Electron App Example

## Install
```bash
git checkout misc/electron_example
npm install -g gulp
npm install
```

## Run
```bash
npm start
```

### Live Reload
Instead of running `npm start`, run `npm run watch`.
That will build the app and automatically refresh the electron window when files are changed.


## Release
```bash
npm install -g electron-packager
npm run build
electron-packager build --platform=[darwin|linux|mas|win32] --arch=[ia32|x64]
```