# deno-env-check

CLI tool to check environment variables.

## Run

```shell
# Run source code
deno run --allow-read --allow-env src/main.ts --env=src/env.json

# Run binary
bin/env-check --env=src/env.json
```

## Compile

```shell
deno compile --allow-read --allow-env --output bin/env-check src/main.ts
```
