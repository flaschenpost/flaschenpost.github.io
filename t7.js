class SimpleExtension {
    constructor(runtime){
      this.runtime=runtime;
    }
    getInfo() {
        return {
            "id": "simpleextension",
            "name": "Simple Extension",
            "blocks": [
                {
                    "opcode": "logVariables",
                    "blockType": "command",
                    "text": "log variables with prefix [TEXT]",
                    "arguments": {
                        "TEXT": {
                            "type": "string",
                            "defaultValue": "Debug:"
                        }
                    }
                }
            ]
        };
    }

    logVariables(args) {
        const prefix = args.TEXT;
        console.log(prefix, "Starting variable dump");
        
        // Get all targets (sprites + stage)
        const targets = this.runtime.targets;
        
        // For each target, log its variables
        targets.forEach(target => {
            console.log(prefix, "---", target.getName(), "---");
            const variables = target.variables;
            Object.values(variables).forEach(variable => {
                console.log(prefix, variable.name, "=", variable.value);
            });
        });
    }
}

Scratch.extensions.register(new SimpleExtension());

/*
// Register the extension
(function() {
    var extensionInstance = new SimpleExtension(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
*/
