// scratch-list-extension.js
class ListExtension {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            "id": 'listoperations',
            "name": 'List Operations',
            "blocks": [
                {
                    "opcode": 'readList',
                    "blockType": 'reporter',
                    "text": 'read all items from list [LIST]',
                    "arguments": {
                        "LIST": {
                            "type": 'string',
                            "menu": 'lists'
                        }
                    }
                },
                {
                    "opcode": 'writeToList',
                    "blockType": 'command',
                    "text": 'write values [VALUES] to list [LIST]',
                    "arguments": {
                        "LIST": {
                            "type": 'string',
                            "menu": 'lists'
                        },
                        "VALUES": {
                            "type": 'string',
                            "defaultValue": '1,2,3'
                        }
                    }
                }
            ],
            "menus": {
                "lists": {
                    "acceptReporters": false,
                    "items": 'getAllLists'
                }
            }
        };
    }

    getAllLists() {
        // Get all list names from the current project
        const lists = [];
        const stage = this.runtime.getTargetForStage();
        
        if (stage) {
            Object.keys(stage.variables).forEach(id => {
                const variable = stage.variables[id];
                if (variable.type === 'list') {
                    lists.push(variable.name);
                }
            });
        }

        return lists;
    }

    readList(args) {
        const listName = args.LIST;
        const stage = this.runtime.getTargetForStage();
        
        if (!stage) return '';

        // Find the list by name
        const list = Object.values(stage.variables).find(v => 
            v.type === 'list' && v.name === listName
        );

        if (!list) return '';

        // Return list contents as comma-separated string
        return list.value.join(',');
    }

    writeToList(args) {
        const listName = args.LIST;
        const values = args.VALUES.split(',').map(v => v.trim());
        const stage = this.runtime.getTargetForStage();
        
        if (!stage) return;

        // Find the list by name
        const list = Object.values(stage.variables).find(v => 
            v.type === 'list' && v.name === listName
        );

        if (!list) return;

        // Clear the list and add new values
        list.value.length = 0;
        values.forEach(value => list.value.push(value));
    }
}

// Register the extension
(function() {
    var extensionInstance = new ListExtension(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()

