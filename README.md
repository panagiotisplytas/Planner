# planner

An easy-to-use app to schedule day-to-day events, tasks and reminders.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Ionic cli
- Android Studio

### Installing

A step by step series of examples that tell you how to get a development env running

First clone or download the repository.

Open up a terminal and navigate to the root folder of the project and run this command to install all dependencies

```
    npm install
```

Then run this command for the initial build.

```
    ionic build
```

Then run the next commands to add capacitor android platform

```
    npx cap sync
    npx cap add android
```

After it finishes go to the MainActivity.java and add those lines needed for the sqite plugin.

```java
    ...
    import com.getcapacitor.community.database.sqlite.CapacitorSQLite;
    ...

    public class MainActivity extends BridgeActivity {


        this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
          ...
          add(CapacitorSQLite.class);
        }});
    }
```

Then run to continue to Android Studio

```
    npx cap open android
```

## Built With

- [Ionic](https://github.com/ionic-team/ionic-framework)
- [Angular](https://github.com/angular/angular)
- [Capacitor](https://github.com/ionic-team/capacitor)
- [JSONBin](https://jsonbin.io)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to Simon Grimm for the [tutorial](https://devdactic.com/sqlite-ionic-app-with-capacitor/), which i used some parts of, on how to use the [sqlite plugin](https://github.com/capacitor-community/sqlite).
