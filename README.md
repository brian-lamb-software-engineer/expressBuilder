# expressBuilder
node express scaffold builder and toolkit

expressBuilder

A complete Express based web stack scaffold and development toolkit.

Introducing the first official complete NEMM web bundle. The NEMM stack
is based on Node.js server, Express.js framework, mongoDB and Mongoose ODM.
It's similar to the "mean" stack, just one step decoupled with a well known
tasker, some imperative tasks tailored more towards small business, to
enterprise level web specific development, and with a whole lot of
scalability!

expressBuilder is a toolkit which will help achieve a very rapid web
application prototype, which is both scalable and immediately usable. It's
greatest feature is its meant to be used as the ground-level engineering
scaffold for a new product.

This builder uses Gulp  as it's task runner. It incorporates many open-
source repositories most of which are related to compiling your source to
build, tasks such as linting, minifying, uglifying, compression and the
like.  There is one brilliant task that fires up a live-reload server, and
a file watcher, so that you can begin to live-edit immediately on your source
files, and watch them automatically reload in multiple browsers the second
you save.  This feature alone should greatly expedite responsive development.

The vendor tasks include a working sass, bootstrap and jQuery
implementation. Add more / change as you like by copying ane of the Gulp
compile-vendors task examples, then add an entry to get it loaded on your
client-side view template (e.g. script / src tag).  Now you just
re-run three quick tasks, compile-vendors, build, then develop.  You are now
back in live-reload development mode, have fun!

Measures have been taken to avoid having to use bower, grunt, and the like in
order to keep things simple.  For example, at the time of this writing, the
bootstrap-sass docs don't yet have documented a way to implement this straight
into gulp, and others who have, used bower. This would be pointless to add
bower simply to get npm modules into a directory.  The vendor specific tasks
on the gulpfile will guide you on how to accomplish this.

A word on the web application which is the actual output of this build: This
is is a standard JavaScript / HTML5 specification client-side web ui.  The
middle-ware of this web application is not just static templates, it contains
a SOA web service which has an API (see controllers). A CRUD layer which acts
on this API layer is included to help fast-track, as a full-suite.

During version control, don't commit anything until you can successfully run the
"gulp develop" command, without seeing any lint errors, etc.., Then you would
want to stop the server and commit your changes, then restart.

Some basic usage instructions:
-clone the repo
-cd to cd to cloned project dir in your terminal
-install your npm packages, i belive this is to run `npm install` from this project dir.  Some adjustments might be needed here if my brain is as offline as it seems, its really late.

-once you have all teh npm packaes installed, that are listed on the package.json, your good.  they should end up in the project/expressBuilder/node_modules directory, you can now run the purposed application. 

-First do a build of vendors
  `$ gulp compile-vendors`
  this will move vendors perscribed in the gulp task from your node modules into the vendor dir
  
-Now do a build from your source files
  `$ gulp build`
  This will move the src files into a new build output dir (e.g. www or public) for http hosting, refresh and viewing shortly. 
  
-Now run the thing, using the develop task, it runs a special live reload server, and lints, hints, and runs your unit tests so you can get a quick status before moving onto new development. 

  `$ gulp develop`
  This will a live reload server, tested in windows chrome, and windows firefox to be working, thus far.
    
-New development primarily consists of deciding to fix any errors that you just saw in the lint, or unit tests, or if none,  decide to engineer  in teh src/ directory, or test/ directory, or maybe you need to add a new route to your server (mmdb.js in this case)


Normally, when you tweak your sources during development, run the following after
    `$ gulp build && gulp develop;`
    
If your not sure if you tweaked anything related to the compile-vendors portion, there is a command that will include that one as well, called gulp all
    `$ gulp all`

The default task, i.e. `$ gulp` is equivalent to `$ gulp develop`, which doesnt rebuild, it just starts the watch. then as long as you save after, then your page will refresh.  


As a debug if your not seeing error output, or after your done with development and just want to run it, try to run the default server `$ ./bin/www`
