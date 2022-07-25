---
title: haproxy + authelia for auth
date: 2021/07/21
description: using haproxy + authelia with auth_request
tag: auth,haproxy,authelia
author: Zach Nedwich
---
# haproxy, authelia and friends

## intro

i'm using the alpine docker image for HAProxy, most guides suggest building a custom image with lua-json installed but it's not necessary and this way means less image rebuilds for me, i can pull the `alpine` tag on a schedule like the cowboy i am 🤠

thx to @TimWolla who's implemented the [nginx](https://nginx.org/en/docs/http/ngx_http_auth_request_module.html) [auth_request module for HAProxy in lua](
https://github.com/TimWolla/haproxy-auth-request) it's easy to secure backends with Authelia. I also tried this with `keycloak` and `oauth2-proxy` for a full OIDC experience but it was way more complicated. Authelia has an OAuth2 provider in [beta](https://www.authelia.com/docs/configuration/identity-providers/oidc.html) as of writing this, so give it a try. i only needed a single user and not full IAM so the file provider was a good compromise.

## docker-compose
first up, set up docker-compose with everything we need:

`docker-compose.yml`
```
version: "3.7"

services:
  haproxy:
    image: haproxy:alpine
    restart: always
    environment:
      - TZ=Australia/Brisbane
    volumes:
      - '/docker/haproxy:/usr/local/etc/haproxy:ro'
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - authelia

  authelia:
    image: authelia/authelia
    volumes:
      - '/docker/authelia/authelia:/config'
    restart: unless-stopped
    environment:
      - TZ=Australia/Brisbane
    depends_on:
      - redis

  redis:
    image: redis:alpine
    volumes:
      - '/docker/authelia/redis:/data'
    restart: unless-stopped
    environment:
      - TZ=Australia/Brisbane
```


## haproxy cfg
i grabbed the following haproxy deps:

[json.lua](https://raw.githubusercontent.com/rxi/json.lua/master/json.lua)

[http.lua](https://raw.githubusercontent.com/haproxytech/haproxy-lua-http/master/http.lua)

[auth-request.lua](https://raw.githubusercontent.com/TimWolla/haproxy-auth-request/main/auth-request.lua)

move these to your haproxy config folder like so:

```
haproxy
├── auth-request.lua
├── haproxy-lua-http
│   └── http.lua
├── haproxy.cfg
├── json
    └── json.lua
```

i think json needs to be inside a `json` folder so lua can resolve it 🤷‍♀️

edit `haproxy.cfg`, [the authelia guide](https://www.authelia.com/docs/deployment/supported-proxies/haproxy.html) is really helpful.

mine looks like this (important parts only):

```
global
...
        lua-prepend-path /usr/local/etc/haproxy/?/json.lua
        lua-prepend-path /usr/local/etc/haproxy/?/http.lua
        lua-load /usr/local/etc/haproxy/auth-request.lua
...
```
all of our lua scripts are loaded

```
frontend webreverse
...
        # auth stuff

        # req headers for Authelia
        http-request set-var(req.scheme) str(https) if { ssl_fc }
        http-request set-var(req.scheme) str(http) if !{ ssl_fc }
        http-request set-var(req.questionmark) str(?) if { query -m found }
        http-request set-header X-Real-IP %[src]
        http-request set-header X-Forwarded-Method %[var(req.method)]
        http-request set-header X-Forwarded-Proto %[var(req.scheme)]
        http-request set-header X-Forwarded-Host %[req.hdr(Host)]
        http-request set-header X-Forwarded-Uri %[path]%[var(req.questionmark)]%[query]
```
Authelia needs these headers set to work properly    
```
acl auth var(txn.txnhost) -m str -i auth.znedw.com
acl protected-frontends hdr(host) -m reg -i ^(?i)(git|nextcloud|)\.znedw\.com
```
acl for my Authelia instance (auth.znedw.com) and my `protected` hosts...
```      
http-request lua.auth-request auth /api/verify if protected-frontends
http-request redirect location https://auth.znedw.com/?rd=%[var(req.scheme)]://%[base]%[var(req.questionmark)]%[query] if protected-frontends !{ var(txn.auth_response_successful) -m bool }

use_backend auth if auth
```
this is the guts of it. `{authUrl}/api/verify` returns a 2xx response if the user has an Authelia session, otherwise it returns a 401. This result is stored in `txn.auth_response_successful`. If it's `false` and we're trying to access a protected resource, it'll redirect to my auth backend, with the `rd` query param, so we end up back at the original requested resource!
```
backend auth
        mode http
        server auth authelia:9091 check
```
backend for authelia, use the container name here

## authelia setup

as mentioned, i'm using the flat-file provider...
most of my config is the defaults from the docs.

make sure email is working, reset yr pwd and enrol for 2fa

`users_database.yml`
```
users:
  zach:
    password: $argon2<hunter2>
    displayname: Zach Nedwich
    email: zach@znedw.com
    groups:
    - admins
    - dev
```

`configuration.yml`
```
host: 0.0.0.0
port: 9091
jwt_secret: <hunter2>
default_redirection_url: https://auth.znedw.com
totp:
  issuer: znedw.com

authentication_backend:
  file:
    path: /config/users_database.yml

access_control:
  networks:
    - name: internal
      networks:
        - 10.0.0.0/8
        - 172.16.0.0/12
        - 192.168.0.0/16
  default_policy: two_factor

session:
  name: authelia_session
  secret: <hunter2>
  expiration: 3600  # 1 hour
  inactivity: 300  # 5 minutes
  domain: znedw.com  # Should match whatever your root protected domain is

  redis:
    host: redis
    port: 6379

regulation:
  max_retries: 3
  find_time: 120
  ban_time: 300

storage:
  local:
    path: /config/db.sqlite3

notifier:
  smtp:
    host: mail.znedw.com
    port: 25
    sender: noreply@znedw.com
```
