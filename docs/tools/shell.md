# Shell

AIVAX offers a virtual shell environment that can be used by agent assistants to execute terminal commands during inference. This feature is especially useful for tasks such as data manipulation, API calls, script execution, and workflows that are easier to express as command-line operations.

The shell environment allows moving selected model tools to the shell side, turning them into CLI commands. This is useful when you have many tools and do not want to expose all of them directly to the model, or when a tool is easier to use through command-line arguments and pipes.

When enabled in an AI Gateway, the model sees a `shell` tool with one argument: `command`. Commands run in a sandboxed shell with network modules, filesystem defaults, and a workspace mounted at `/home/workspace`. The current backend limits each command to 30 seconds and returns up to 4,096 characters of output to the model.

## Adapting tools for shell

In the virtual shell interface, standard command-line utilities and registered shell modules are available. This way, you can adapt your tools to return raw or long outputs, and the model can use the shell's text manipulation tools to extract the relevant information, for example:

```bash
get-users --filter active --format csv | grep "John Doe" | awk -F, '{print $1, $2}'
```

In the line above, `get-users` is a custom tool that returns a list of users in CSV format. The `grep` command filters the results to find "John Doe", and `awk` extracts and formats the desired columns. This tool may have been defined by [MCP](/docs/tools/mcp), [built-in tools](/docs/tools/builtin-tools) or be a [protocol tool](/docs/tools/protocol-functions).

Tools moved into the shell are no longer exposed as direct model functions, except reserved tools such as `shell` and `read_skill`. Configure the shell tool list as either:

- `WhiteList`: only listed tools are exposed as shell commands.
- `BlackList`: listed tools remain direct model tools, and the other non-reserved tools are exposed as shell commands.

Use the runtime function name when listing tools, such as `web_search`, `open_url`, `request`, or a protocol/MCP function name. Each shell command generated from a tool supports `--help` and maps JSON Schema properties to command-line options.

## Data persistence

It is possible to define data persistence for the shell environment. When `allowDataPersistence` is enabled and the inference context has a user external ID, AIVAX mounts a persistent workspace scoped to the account and user. This allows the agent to keep files across conversations and sessions for that identified user.

If persistence is disabled, or the inference context has no user external ID, the shell uses an in-memory filesystem and the workspace is discarded after the inference iteration.

## Shell file API

AIVAX also exposes Shell I/O endpoints under `/api/v1/shell/io` for authenticated accounts. These endpoints use the required `X-Shell-User-Id` header to scope the filesystem sandbox and support listing directories, downloading files, inspecting file metadata, creating temporary public file addresses, uploading files, creating directories, and deleting files or directories. Uploads are documented with a 100 MB maximum request body.
