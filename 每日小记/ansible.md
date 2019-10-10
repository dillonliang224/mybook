# Ansible


## when 语句


```yaml
## 执行命令
## -e wechat=true 走copy file to build，略过npm run build
## -e wechat= 走npm run build，略过copy file to build

- name: copy file to build
  copy:
    src: '{{CP_SRC}}'
    dest: '{{CP_DEST}}'
  when: wechat

- name: npm run build
  shell: 'cd {{REPO_DIR}} && {{INIT_NVM}} && nvm use && npm run build'
  when: not wechat
```

## copy模块

src指定本地来源
dest指定远程绝对地址

```yaml
- name: copy file to build
  copy:
    src: '{{CP_SRC}}'
    dest: '{{CP_DEST}}'
```