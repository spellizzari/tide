tide - Typescript Integrated Development Environment
====================================================

More will be added later.

Architecture
============

tide is made of a _core_ and some _packages_. The packages contain features implementation, such as support for a given language, designers, tools, etc. while the core contains all the glue that makes them work together.

The core
--------

The core is made of the following sections:
* the _toolbox_, which contains simple code used by other code units.
* the _ui base_, which contains basic UI management for templating and internationalization.
* _ui controls_, which are the basic UI controls used by the application.
* the _data model_, which contains classes modeling user data and UI data.

# The toolbox #

The toolbox defines several classes and functions that are used through the application. It contains an exception model, an event dispatcher class and generic classes to keep source code organized and flexible.

# The data model #

The data model contains a set of classes representing the key concepts of the application for both user data and UI data, such as workspaces, projects, project items, packages, editors, commands, etc. Some classes are meant to be inherited by packages, some are serialized to disk when the user saves his/her work, some others are instantiated by packages to provide features to the application, etc.

## Application ##

The `Application` class represents the state of the running application. It provides access to everything else for package developers. It also tracks mouse and keyboard states such as keyboard focus and mouse focus, in order for packages to be able to respond to focus changes. Application has its own settings that are serialized to disk along with the application binaries, and can contain package-specific information.

## Static Panels ##

Static panels are areas of the application UI providing specific information. Static panels are unique and permanent. They are registered by packages and are placed by the user in the application window. Static panels are represented by the `StaticPanel` class, which is abstract. The core registers some static panels such as the _Workspace Explorer_ panel showing the current workspace, the _Diags_ panel showing low-level messages emitted by packages, the _Errors_ panel showing warnings and errors, etc.

## Dynamic panels ##

Dynamic panels are not unique and permanent. They can only be shown in the center area of the application window and don't have the same lifespan as static panels: they are created on demand, several kinds of dynamic panels of the same type can exist at the same time, and they can be closed by the user. They are typically meant to present editors for source files and settings. Dynamic panels are represented by the `DynamicPanel` class. The core provides some implementations of the dynamic panel class, such as `SettingsPanel` which represents 

## Workspaces ##

A workspace represents a set of projects. It is represented by the `Workspace` class. A workspace is serialized to a
`*.tideworkspace` file in JSON format that contains all the information about the workspace, including paths to included projects
and package-specific options.

Only one workspace can be loaded in the application UI at a time. The current workspace is accessible from the instance of the `Application` class. To the user, the workspace is shown in the _Workspace Explorer_ pane as the root of a node tree.

## Projects ##

A project represents a set of source files, information about compiling those files into their final form, and information about debugging them. A project is represented by the `Project` class. It is serialized to a `*.tideproj` file in JSON format that contains paths to included files, package-specific options, compilation and debugging settings.

A workspace can contain any number of projects. Projects are shown in the _Workspace Explorer_ pane as node items in the workspace tree.

## Project Items ##

A project item represents an element of a projet. Project items are represented by the `ProjectItem` class, which is abstract. The core provides the `FileProjectItem` class that inherits from `ProjectItem` and represents a project item that is linked to a source file, and a `FolderProjectItem` class that represents a project item linked to an existing folder. Project items are serialized in the project file and can contain package-specific information. Packages can also implement the `ProjectItem` class to provide new types of project items.

A project can contain any number of project items. Project items are shown in the _Workspace Explorer_ pane as node items under the project item, and can be arranged in a subtree or ordered programmatically.

## Commands ##

Commands are actions triggered on menu item/button clicks or keyboard shortcuts. A command is represented by the `Command` class, which is abstract. They are registered by packages using the instance of the `Application` class. A command has several static information such as a name, a description, a context (the kind of object it applies to, like a workspace, a special kind of project item, or the whole application), a default keyboard shortcut, etc. Commands are then placed in UI menus and toolbars by packages and can be customized by the user. Commands can dynamically generate an option list. The user will be able to choose an option from the list (for example if the command is invoked from a menu, the menu will expand with the list of options) and the chosen option will be passed to the command to execute.

## Settings Editors ##

Workspaces, projects and project items have settings serialized to disk. In order for the user to be able to edit those settings, packages can provide settings editors to the application. They will be used when the user opens a settings pane from a workspace, project, etc.

Developer Dependencies
======================

* [NodeJS](http://nodejs.org/) (MIT License)
* [ShellJS](https://github.com/arturadib/shelljs) (BSD License)
* [TypeScript](http://www.typescriptlang.org/) (Apache 2.0 License)
* [TSD](https://github.com/Diullei/tsd) (MIT License)

Runtime Dependencies
====================

* [NodeJS](http://nodejs.org/) (MIT License)
* [TypeScript](http://www.typescriptlang.org/) (Apache 2.0 License)
* [node-webkit](https://github.com/rogerwang/node-webkit) (MIT License)
* [Ace](http://ace.ajax.org/) (BSD License)
* [Bootstrap](http://twitter.github.io/bootstrap/) (Apache 2.0 License)
* [jQuery](http://jquery.com/) (MIT License)
* [knockout.js](http://knockoutjs.com/) (MIT License)
* [node-optimist](https://github.com/substack/node-optimist) (MIT License)
