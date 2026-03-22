# Shell

AIVAX provides a virtual shell environment that can be used by agent assistants to execute terminal commands. This feature is especially useful for tasks such as automation, system management, script execution, and other operations that require interaction with the operating system.

The shell environment allows moving tools used by the agent to the shell side, turning them into a CLI tool. This is advantageous when you have hundreds of tools and don't want to overload the model's context, or when the tools have a more complex command-line interface that would be difficult to call directly from the model.

## Adapting tools for shell

In the virtual shell interface, standard operating system manipulation tools are available, such as `grep`, `awk`, `sed`, `curl`, `wget`, among others. This way, you can adapt your tools to return raw or long outputs, and the model can use the shell's text manipulation tools to extract the relevant information, for example:

```bash
get-users --filter active --format csv | grep "John Doe" | awk -F, '{print $1, $2}'
```

In the line above, `get-users` is a custom tool that returns a list of users in CSV format. The `grep` command filters the results to find "John Doe", and `awk` extracts and formats the desired columns. This tool may have been defined by [MCP](/docs/en/tools/mcp), [builtin tools](/docs/en/builtin-tools) or be a [protocol tool](/docs/en/protocol-functions).

It is not possible to virtualize tools that run on the client side in the bash environment. Attempting to do so will result in an error returned by the API. Define tools in the shell's white-list or black-list to control which tools are available to be used in the shell environment.

## Data persistence

Data persistence can be defined for the shell environment. When enabled, the inference user (via the `$.user` or `$.tag` parameter of the chat client) will have an exclusive virtual shell environment that can be accessed across different conversations and sessions. This is useful when the agent needs to maintain state between sessions, such as temporary files, logs, or other data that needs to be persisted.

If this persistence is disabled, the shell environment is discarded after an inference iteration.

## Emulation

The shell environment is emulated in a sandbox environment and is not connected to the real operating system. This means that certain tools such as `apt-get` will not be available to the model. The environment is designed to be safe and isolated, avoiding any impact on the real system. It is ideal for text processing tasks, data manipulation, and other operations that do not require direct access to the operating system.

The shell environment is capable of:
- Executing basic I/O commands, such as reading and writing files, text manipulation, and script execution.
- Accessing the internet to make HTTP requests using tools like `curl` or `wget`.
- Compressing and decompressing files using tools like `tar` and `zip`.
- Reading content from various file formats into markdown.
- Executing bash scripts.