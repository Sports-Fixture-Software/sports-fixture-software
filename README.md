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
1. Run the SANFL application. That will create an empty `sanfl_fixture_software.database`
1. Exit the SANFL application.
1. Run `sqlite3 sanfl_fixture_software.database`
1. From the sqlite3 prompt enter: `insert into League (name) values ("alpha");`
1. Quit sqlite3 with `.q`
1. Re-run the SANFL application. A league will now be displayed.

## Release
```bash
npm install -g electron-packager
npm run build
electron-packager build --platform=[darwin|linux|mas|win32] --arch=[ia32|x64]
```

