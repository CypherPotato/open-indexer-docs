# Shell

A AIVAX offers a virtual shell environment that can be used by agent assistants to execute terminal commands. This feature is especially useful for tasks such as automation, system management, script execution, and other operations that require interaction with the operating system.

The shell environment allows moving tools used by the agent to the shell side, turning them into a CLI tool. This is advantageous when you have hundreds of tools and do not want to overload the model context, or when tools have a more complex command-line interface that would be difficult to call directly by the model.

## Adapting tools for shell

In the virtual shell interface, standard operating system manipulation tools are available, such as `grep`, `awk`, `sed`, `curl`, `wget`, among others. This way, you can adapt your tools to return raw or long outputs, and the model can use the shell's text manipulation tools to extract the relevant information, for example:

```bash
get-users --filter active --format csv | grep "John Doe" | awk -F, '{print $1, $2}'
```

In the line above, `get-users` is a custom tool that returns a list of users in CSV format. The `grep` command filters the results to find "John Doe", and `awk` extracts and formats the desired columns. This tool may have been defined by [MCP](/docs/en/tools/mcp), [built-in tools](/docs/en/tools/builtin-tools) or be a [protocol tool](/docs/en/tools/protocol-functions).

It is not possible to virtualize tools that run on the client side in the bash environment. Attempting to do so will result in an error returned by the API. Define tools in the shell's white-list or black-list to control which tools are available to be used in the shell environment.

## Data persistence

It is possible to define data persistence for the shell environment. When enabled, the inference user (via the `$.user` or `$.tag` parameter of the chat client) will have an exclusive virtual shell environment, which can be accessed across different conversations and sessions. This is useful when the agent needs to maintain state between sessions, such as temporary files, logs, or other data that needs to be persisted.

If this persistence is disabled, the shell environment is discarded after an inference iteration.