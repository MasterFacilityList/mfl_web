# mfl_web
This is the publicly accessible front-end the [Kenyan MFL v2](https://github.com/MasterFacilityList/mfl_api).

[![Circle CI](https://circleci.com/gh/MasterFacilityList/mfl_web.svg?style=svg)](https://circleci.com/gh/MasterFacilityList/mfl_web)


![Grunt](https://cdn.gruntjs.com/builtwith.png)


[![Sauce Test Status](https://saucelabs.com/browser-matrix/mfl-public-web.svg)](https://saucelabs.com/u/mfl-public-web)


## Project organization
The project's structure has been derived from [ng-boilerplate](https://github.com/ngbp/ngbp/blob/v0.3.2-release/README.md#overall-directory-structure)

```
mfl_web/
  |- coverage/    #  contains coverage output
  |- build/    # contains output of the build process, used to serve files in development
  |- bin/    # contains output of the compile process, used to serve files in production
  |- karma/    # contains configuration for karma
  |  |- karma-unit.tpl.js
  |- src/      # contains the source code of the application
  |  |- app/      # contains the source code of the angular app and app-specific code
  |  |  |- app1    # a single app
  |  |  |  |- tpls      # contains app1's templates/partials
  |  |  |  |  |- app1.tpl.html
  |  |  |  |  |- app2.tpl.html
  |  |  |  |- tests      # contains app1's tests
  |  |  |  |  |- module.spec.js
  |  |  |  |  |- routes.spec.js
  |  |  |  |  |- controllers.spec.js
  |  |  |  |- module.js      # contains app1's module definition
  |  |  |  |- routes.js      # contains app1's states
  |  |  |  |- controllers.js # contains app1's controllers
  |  |  |  |- ...
  |  |  |- app2
  |  |  |- app3
  |  |  |- ...
  |  |- assets/      # contains the application's assets
  |  |  |- <static files>
  |  |- less/        # contains the application's less files
  |  |  |- main.less
  |  |- settings.js  # contains the application's 'environment' configuration
  |- vendor/
  |- .bowerrc
  |- bower.json
  |- build.config.js
  |- changelog.tpl
  |- circle.yml
  |- .gitignore
  |- .jshintrc
  |- Gruntfile.js
  |- module.prefix
  |- module.suffix
  |- package.json
```


## Development

All the commands in this section assume that the current working directory is the root of the project.

### Requirements
The project requires `nodejs` to be installed in your system

### Getting started
First install npm and bower dependencies

```bash
$ npm install
```

The command shall install bower dependencies right after npm dependencies are installed.

If grunt or bower are not installed globally in your system or you want to use the ones installed by the project,
you may have to add the `bin` directory in `node_modules` to system PATH.

```bash
export PATH="$(npm bin):$PATH"
```

### Development environment
Run `grunt connect:dev` to serve files. This server uses development only files.

To automatically build files after changes, run `grunt watch`.

If you don't want to have automatic builds, run `grunt build` to build files.


### Production environment

To see what is going to be used in production, run

```bash
$ grunt
```

or

```bash
$ grunt build
$ grunt compile
```

This will create the 'compiled' files in the `bin` directory.

The files can then be served using

```bash
$ grunt connect:prod
```


## Testing

Running tests is as easy as running

```bash
$ grunt test
```
