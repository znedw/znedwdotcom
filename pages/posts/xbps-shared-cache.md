---
title: xbps shared cache
date: 2019/05/18
description: xbps shared cache
tag: xbps
author: Zach Nedwich
---
# xbps shared cache
The simplest answer is always better.

Caching packages is a problem with many solutions, there's apt-cacher-ng which is built specifically to solve this issue, but I couldn't get it to work for xbps and promptly gave up.

I then configured a Varnish server and pointed all of my computers mirrorlists to it.

This worked okay, but the cache didn't survive reboots, and I had to write some VCL to always fetch specific files (the repo database).

VCL isn't so bad, this is what I came up with:
```
backend default {
    .host = "ftp.swin.edu.au";
    .port = "80";
}

sub vcl_backend_response {
  set beresp.ttl = 4w;
}

sub vcl_recv {
        if (req.url ~ "repodata") {
                return(pass);
        }
}
```
I didn't need SSL, Varnish doesn't speak SSL, I let my HAProxy server do the SSL termination.

Deep down I knew this wasn't the right solution, okay, back to the drawing board.

I read a comment somewhere, on Reddit maybe, about a pacman user who exported their package directory as an NFS share, ah of course, so simple, so I set to it.

First, the share, my server fstab looks like this:

`/var/cache/xbps /export/xbps non defaults,bind 0 0`

And all of my clients' fstabs look like this:

`nfsserver:/export/xbps /var/cache/xbps nfs auto,noatime,rsize=65536,wsize=65536,intr,_netdev,timeo=300,retrans=1 0 0`

Easy right, there's some extra NFS incantations to export the bind mounted share.

This lives in /etc/exports and for simplicities sake, I allow connections on all interfaces:

/export/xbps    *(rw,no_root_squash,no_subtree_check)
This all works a treat, my package cache is shared between all of my machines, and my struggling 10mbit ADSL connection can have a reprieve.

Say what you want about NFS, this took 5 minutes all told and works better than my previous solution.
