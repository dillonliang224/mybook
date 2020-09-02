golang代码在github里添加action来自动检查lint

```bash
name: reviewdog
on: [pull_request]
jobs:
  golangci-lint:
    name: runner / golangci-lint
    runs-on: ubuntu-latest
    steps:
      - name: Check out code into the Go module directory
        uses: actions/checkout@v1
      - name: golangci-lint
        uses: reviewdog/action-golangci-lint@v1
        with:
          golangci_lint_flags: "--enable-all --timeout=10m --exclude-use-default=false"
          workdir: pkg # 这个如果你的项目没有什么特殊情况，也是不需要设置的
```
