---
title: let's encrypt wildcard certificates & ephemeral nsd
date: 2019/05/18
description: let's encrypt wildcard certificates & ephemeral nsd
tag: letsencrypt
author: Zach Nedwich
---
# let's encrypt wildcard certificates & ephemeral nsd

So you're running your own authoritative nameserver (namely nsd) and you want to use Let's Encrypt's dns-01 challenge to get a wildcard cert, for your internal servers?

This is easier than it sounds! Credit goes to this comment on HackerNews and this blog post for pointing me in the right direction.

Some caveats: while my main nameserver has DNSSEC and TLSA, I will not be covering this, read the link above for some pointers
First you need to add an NS record to your nameserver(s) for your temporary acme nameserver which, from here on, I will refer to this server as `acme-dns`. I added two RRs to the zone I want to validate on my nameserver:

First an A record for my new 'acme-dns' temporary nameserver:
```
acme-dns.znedw.com.     86400   IN      A       XXX.XXX.XXX.XXX`
```
Then an NS record to allow the new server to answer authoritatively for my zone:
```
_acme-challenge.znedw.com.      86400   IN  NS acme-dns.znedw.com.
```
Note the underscore, it's important, this is a well-known acme thing.

This works like a glue record and delegates acme-dns as the authority on the subdomain `_acme-challenge`, cool!

You can check the delegation has worked with this tool, but don't expect an answer, just yet.

Now we need a temporary nsd instance, install nsd somewhere, internally is good.

My nsd.conf was nice and basic, no DNSSEC here.

Remember to run `nsd-control-setup` to generate your keypair for remote control.
```
server:
        hide-version: yes
        verbosity: 1
        database: ""
        interface: 192.168.0.xxx

remote-control:
        control-enable: yes
        control-interface: /var/run/nsd.sock
        server-key-file: "/var/nsd/etc/nsd_server.key"
zone:
        name: "_acme-challenge.znedw.com"
        zonefile: "master/acme-challenge.znedw.com.zone"                                                        
```
I created my acme zone in /etc/nsd/master/acme-challenge.znedw.com.zone.

You really just need an SOA, the verification TXT record will be added automatically later.
```
$ORIGIN _acme-challenge.znedw.com. ; default zone domain
$TTL 86400 ; default time to live

@ IN SOA acme-dns.znedw.com. _acme-challenge.znedw.com. (2019051801;serial 28800;Refresh 7200;Retry 864000 ;Expire 86400;Min TTL)
NS acme-dns.znedw.com.
@ IN TXT "I'm not here"
```

Run `nsd-checkconf /etc/nsd/nsd.conf`, empty result is good.

Run `nsd-checkzone $yourZoneName $pathToZoneFile`, it should say zone is ok.

Fire up nsd in foreground mode with `nsd -dV5`, fix any warnings or errors.

You will need to allow incoming connections on port 53 for TCP and UDP to allow queries to your new nsd server.

I use pf and the syntax on my router was something like:
```
pass in log on $wan proto { tcp, udp } to any port domain \
                        rdr-to 192.168.0.XXX set prio (5,6)
```

Cool, so we've got some delegation happening, and a nameserver, you can check everything is working with dig or drill like so `drill txt _acme-challenge.znedw.com`.
```
> drill txt _acme-challenge.znedw.com
;; ->>HEADER<<- opcode: QUERY, rcode: NOERROR, id: 18999
;; flags: qr rd ra ; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 0
;; QUESTION SECTION:
;; _acme-challenge.znedw.com.   IN      TXT

;; ANSWER SECTION:
_acme-challenge.znedw.com.      42022   IN      TXT     "I'm not here"

;; AUTHORITY SECTION:

;; ADDITIONAL SECTION:

;; Query time: 0 msec
;; SERVER: 192.168.0.1
;; WHEN: Sat May 18 16:21:56 2019
;; MSG SIZE  rcvd: 124
```
Time to try the acme-challenge for real. I'm using acme.sh as someone has written an nsd hook for it recently!

Here's the important parts of the script I use to renew my cert:
```
# These are required by the DNS hook
export Nsd_ZoneFile="/etc/nsd/master/acme-challenge.znedw.com.zone"
export Nsd_Command="sudo nsd-control reload"
# Start nsd for a minute
sudo nsd
# Note, --staging is for testing, don't abuse the production letsencrypt servers!
# I'm using --dns dns_nsd as my hook
/home/zach/.acme.sh/acme.sh --staging --force --issue -d "*.znedw.com" --dns dns_nsd
# Kill nsd
sudo pkill nsd
```
And the output from a successful run! Hooray!
```
[2019-05-18 16:01:34.960] nsd[5602]: notice: nsd starting (NSD 4.1.27)
[Sat May 18 16:01:35 AEST 2019] Using stage ACME_DIRECTORY
[Sat May 18 16:01:35 AEST 2019] Single domain='*.znedw.com'
[Sat May 18 16:01:35 AEST 2019] Getting domain auth token for each domain
[Sat May 18 16:01:37 AEST 2019] Getting webroot for domain='*.znedw.com'
[Sat May 18 16:01:37 AEST 2019] Adding txt value: xxxx for domain:  _acme-challenge.znedw.com
[Sat May 18 16:01:37 AEST 2019] Added TXT record for _acme-challenge.znedw.com
ok
[Sat May 18 16:01:37 AEST 2019] Successfully updated the zone
[Sat May 18 16:01:37 AEST 2019] The txt record is added: Success.
[Sat May 18 16:01:37 AEST 2019] Let's check each dns records now. Sleep 20 seconds first.
[Sat May 18 16:01:58 AEST 2019] Checking znedw.com for _acme-challenge.znedw.com
[Sat May 18 16:01:58 AEST 2019] Not valid yet, let's wait 10 seconds and check next one.
[Sat May 18 16:02:10 AEST 2019] Let's wait 10 seconds and check again.
[Sat May 18 16:02:21 AEST 2019] Checking znedw.com for _acme-challenge.znedw.com
[Sat May 18 16:02:21 AEST 2019] Domain znedw.com '_acme-challenge.znedw.com' success.
[Sat May 18 16:02:21 AEST 2019] All success, let's return
[Sat May 18 16:02:21 AEST 2019] Verifying: *.znedw.com
[Sat May 18 16:02:32 AEST 2019] Pending
[Sat May 18 16:02:35 AEST 2019] Success
[Sat May 18 16:02:35 AEST 2019] Removing DNS records.
[Sat May 18 16:02:35 AEST 2019] Removing txt: xxxxx for domain: _acme-challenge.znedw.com
[Sat May 18 16:02:35 AEST 2019] Removed TXT record for _acme-challenge.znedw.com
ok
[Sat May 18 16:02:35 AEST 2019] Successfully reloaded NSD
[Sat May 18 16:02:35 AEST 2019] Removed: Success
[Sat May 18 16:02:35 AEST 2019] Verify finished, start to sign.
[Sat May 18 16:02:35 AEST 2019] Lets finalize the order, Le_OrderFinalize
[Sat May 18 16:02:37 AEST 2019] Download cert, Le_LinkCert
[Sat May 18 16:02:38 AEST 2019] Cert success.
```
The long and short of it is that I need to expose my temporary nsd server for a minute or two at a time, but I don't need to expose any of my internal sites, or run acme.sh on my nameserver and copy the certs.

This is very handy if you're in a tight spot!
