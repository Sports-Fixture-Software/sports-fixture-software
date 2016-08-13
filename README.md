# sanfl
## Install
1. If on Windows, update npm. This is needed to fix a bug with electron-rebuild on Windows:  
   `npm install -g npm`
1. Install dependencies:  
   `npm install`
1. Rebuild native node modules. Needed for Sqlite3 because there aren't binary builds available for Electron 1.3.1. This needs a C++ compiler.  
   `./node_modules/.bin/electron-rebuild`
1. Copy the binary Sqlite3 module. This step will be automated in the future, but for now perform manually:
 1. On linux x64:

    ```bash
    mkdir -p build/node_modules/sqlite3/lib/binding/electron-v1.3-linux-x64/
    cp node_modules/sqlite3/build/Release/node_sqlite3.node build/node_modules/sqlite3/lib/binding/electron-v1.3-linux-x64/.
    ```

 1. On Windows:

    ```bash
    mkdir -p build/node_modules/sqlite3/lib/binding/electron-v1.3-win32-x64/
    cp node_modules/sqlite3/build/Release/node_sqlite3.node build/node_modules/sqlite3/lib/binding/electron-v1.3-win32-x64/.
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

