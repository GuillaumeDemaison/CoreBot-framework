# Conroller
They are used to add catch event (bot/msg)

To do that, two methods:
- *hears*: specific message pattern
- *on*: group event categorization

# Composition
They are define in dedicated folder and they need the following files:
- controller name
  - hears or on
    - *run.js*: Scripts with the code
    - *conf.js*: Default configuration file

They are located in the './controller' folder.

## Loading
The modules are loaded with the [loader](./controller/loader.js) script.
The first check is to know if the module is activate or not and
depending of the global, specific or default configuration the module is
loaded or not.
