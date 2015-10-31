expressBuilder
Product Documentation has now been moved to the wiki, please visit there for details.  https://github.com/wolfdogg/expressBuilder/wiki/About-expressBuilder

Basic instructions

Procurement:

-clone

-cd to project dir in a terminal

-install packages `npm install` into the project dir


You can now edit any files to customize your application first:
  a) build out your app; source files (src/) and tests (tests/)
  b) add or alter the tasker tasks to customize your app(gulpfile.js)
  c) customize your application server (mmdb.js)
  d) go to npm and add your needed modules

Or even easier just spin it up to see what it does.  

Launching:

- First, build your vendors  `$ gulp compile-vendors` This will move vendors prescribed in the gulp task from your node modules out to the vendor dir for customization and inclusion
- Next, run a build from your source files `$ gulp build`.  This will move the src files into a new build output dir (e.g. www or public) for http hosting, refresh and viewing shortly.

- Finally, run the development server `$ gulp develop`.  This includes a special task, a "live reload" server, and also lints, hints, and runs your unit tests just prior to firing up the server so that you can get a quick visual checkover of both your server, and application files and their integrity, and immediately prior to beginning your new development

-You can now open your browser to the default port http:/127.0.0.1:3000, or using the IP of your server here if the browser client is on a different machine than the node server.   With this live reload server in its default watch mode, you can immediately begin to edit and save files while your browser slaves to the new adjustments automatically.  This has been found to be working on both windows chrome and windows firefox at least, thus far.

-The idea of any new development now will primarily depend on your need.  If you want an API, most of your work will be in the models and controllers.  If you want a full website, alot of your work will be accessing these new models and controllers by building a ui, which by default is the jade view templates located in view/.  

During your development, the watch command is ready for you as you save it refreshes your browser in certain ways, depending on the file type that you edit.  You can fully tap into, and customize this watch functionality in the gulp `watch` task.  

Basic task flow:

During development of your source files, as you build out your application, if you have edited any tasks, or have done something to error out your server, or the server is stopped for some reason, simply run the following to restart it `$ gulp build && gulp develop;`, then resume development.

If any of your edits are done to the vendor tasks, be sure to run your task to recompile them before you rebuild `$ gulp compile-vendors`.  If you know you will be running the `build` and `develop` tasks after, then instead of running the `compile-vendors`, there is another task for this, called `all`, so just run the following `$ gulp all`.  This will `compile-vendors`, then `build`, then `develop`

The default task, i.e. `$ gulp` is equivalent to `$ gulp develop`, which doesnt rebuild, it just starts the watch. This task is for once you get things worked out on your application, have your tasks set up like you like, then just day by day develop thing, you would just really need to get the watcher and server started.  Do this before editing any files.  As you make your first edit, the watch will take over, and run the build tasks for you on the fly, lint them, etc., then live-reload.  

If something gets broken, as a debug if you’re not seeing error output, or after your done with development and just want to run it, try to run the default server in one of two ways `npm start`, `$ ./bin/www`.  This will normally get you any elusive errors that you were not seeing when running the gulp tasks if something goes awry.

During version control, don't commit anything until you can successfully run the `gulp develop` command, without seeing any lint or unit testing errors, etc…  Once its ready, then you would want to stop the server (ctrl+c on the terminal from which its being ran, or a `pkill` sent), then commit your changes. Rinse and repeat.
