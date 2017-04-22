## expressBuilder

Product Documentation has now been moved to the wiki, please visit there for details.  https://github.com/wolfdogg/expressBuilder/wiki/About-expressBuilder

### Basic instructions

**Procurement and Installation**

- Clone to a new project dir on your server

- `cd` to project dir in a terminal

- Install the applicaion dependencies `npm install`

- To bootstrap, run `gulp`.  Then test the app at http://localhost:3003 You can adjust the domain name if your server is setup up differently, or are testing on a remote intranet or internet server.  There is no need for a reverse proxy setup.  

- You are now free to edit the files while the server is running, and immediatly reap. This is because when you save them, the nodemon and livereload will takeover and send a new head request to any open browsers that you have the application open with, changes take effect automatically.  No need for a refresh.

- Note that there is a build process to keep it slim, minified and compressed, as well as linted, so when you run `gulp` it will clean out most files in the public (`./www`) dir automatically, and lay in a new compressed build, and a new version tag.  This is the only directory thats served and all that needs to be deployed.  

- You can now start development on your new infrastructure.

  a)  For editing the application, see the MVC structured source files in `./src/` and place your tests in `./tests/`.

  b) For editing the server itself see `./bin/www` and the application bootstrapper and router `./.index.js`

**Adding new architecture**

- When your ready to expand the application:

- If you want to add anything, first look for a suitable module here https://www.npmjs.com/.  If you find one, install the module directly using npm e.g. `npm install --save redux`

- If you cant find your module at npm, but find it at github:

  a) add the git hub source to your package json

  b) then add a new gulp vendor task, by copying one of the existing vendors tasks in `./src/assets/js/gulp/vendor` to a new file in the same folder.

  c)inject that task into `./src/assets/js/gulp/build/js.js` in `vendorHeadJs` or `vendorFootJs`, depending on if you need it to load before or after your html. Always opt for vendorFootJs if it works, so your application will stay speedy. Fall back to vendorHeadJs if your not sure, or if your new module is not accessible by your application.

**Before Launching:**

- Prior to launching;

  a) look over the server settings and ports on `bin/www`  

  b) On the bootstrapper/router `./index.js` make sure you adjust the IP address of the app livereload server to match the app servers ip.

**Fine grained control of gulp tasks**

- If you want more fine grained control over the gulp tasks, i.e to run them separately, see the following tasks

  a) `$ gulp compile-vendors` Rebuilds the vendors only. This will rebuild for any recent updated vendor variables, and recompile them.  .  This effectively moves vendors prescribed in the gulp task from your node modules out to `./vendor` for any forther customization then finally inclusion

  b) `$ gulp build` Compresses css, and js, builds jade/pug html templates, and lints the js source files into a new build output dir `./www` for serving.

  c) `$ gulp develop` The final task, which bootstraps the application by running tests, linting, then starting the server, and its watch.  

- You can fully tap into, and customize the watch functionality in the gulp `watch` task.  

**Basic task flow:**

- If any of your edits are done to the vendor tasks, be sure to run your task to recompile them before you rebuild `$ gulp compile-vendors`.  If you know you will be running the `build` and `develop` tasks after, then instead of running the `compile-vendors`, there is another task for this, called `all`, so just run the following `$ gulp all`.  This will `compile-vendors`, then `build`, then `develop`

### Troubleshooting

- If something gets broken, as a debug if you’re not seeing error output, or after your done with development and just want to run it, try to run the server with the debug switch `npm run dev`, `$ nodemon --debug`.  This will normally get you any elusive errors that you were not seeing when running the gulp tasks if something goes awry.

- There is a commented DEBUG Self executing function at the top of both `./gulpfle.js` and `./index.js`.  Uncommenting this will get you a nice backtrace, where you can look at the top of it to see what command was ran, and some parameters that might be helpful to debug.

**Before commting**

  a) During version control, don't commit anything until you can successfully run both `npm install` and `gulp`, without seeing any lint or unit testing errors, etc…  

  b) Once its ready, then you would want to stop the server (ctrl+c on the terminal from which its being ran, or a `pkill` sent), then commit your changes.

- Rinse and repeat.

### Conventions
- source is defined as master files, which are later tasked for build, etc..
- top level dirs seperated by functional requirement for version control, and dependency mgmt.
- assets folder
- includes source versions of all 'static' assets (imgages, css, js, )
- package doesnt include dependencys, vendors, things that belong in lib, config files, etc..
