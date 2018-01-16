## Pre-requisites

1. [.Net core sdk](https://www.microsoft.com/net/core#windows)
2. Either [VSCode](https://code.visualstudio.com/) with [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) extension OR [Visual studio 2017](https://www.visualstudio.com/)
3. [Nodejs](https://nodejs.org/en/)

**Make sure you have Node version >= latest LTS and NPM >= latest LTS

## Installation
```
1. Clone the repo
    git clone https://github.com/asadsahi/AspNetCoreSpa
2. Change directory
    cd AspNetCoreSpa
3. dotnet restore
4. Install global dependencies
    npm install protractor rimraf http-server @angular/cli -g
5. npm install
6. Two ways to run the app (Development mode):
    i) First: (F5 from VScode or Visual studio IDE):
        F5 (This will automatically launch browser)
    ii) Second: (from command line)
        Dev mode:
        npm run dev:watch
        Browse using http://localhost:5000 or https://localhost:5001 
        Prod mode:
        npm run prod:watch

7. Point to Sqllite or SqlServer
    
This project supports both sql server and sql lite databases

* Run with Sqlite:
    * Project is configured to run with sqlite by default and there is an 'Initial' migration already added (see Migrations folder)
    * After changing you models, you can add additional migrations 
    [see docs](https://docs.microsoft.com/en-us/ef/core/miscellaneous/cli/dotnet)

* Run with SqlServer:
    * To run under sql server:
        * npm run clean
        * Flip the switch in appsettings.json called `useSqLite` to `false`, this should point to use local sql server setup   as default instance. (See appsettings.json file for connection string)
        * Run `dotnet ef migrations add "InitialMigrationName"`

```
# Compatability
 * This project is supported in everygreen browsers and IE10+
 * IE8 & IE9 aren't supported since Bootstrap 4 is supported in IE10+ [explained here](http://v4-alpha.getbootstrap.com/getting-started/browsers-devices/).
