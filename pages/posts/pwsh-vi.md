---
title: pwsh key bindings (with vi mode)
date: 2019/12/13
description: pwsh key bindings (with vi mode)
tag: powershell
author: Zach Nedwich
---
# PowerShell (pwsh) keybindings with PSReadLine.
I'm using PowerShell Core 7.0.0-preview.6, I have no idea which versions of pwsh support these commands.

Best to suck it and see :-) .

Create a $PROFILE if you don't have one:
```
New-Item $PROFILE
```
Check that it worked:
```
Test-Path $PROFILE
```      
Open it in your $EDITOR of choice:
```
notepad $PROFILE (or $EDITOR profile)
```     
Add configuration (example, I like using C^P and C^N to navigate prev/next commands):
```
Set-PSReadlineOption -EditMode vi
Set-PSReadlineKeyHandler -Key Ctrl+p -Function PreviousHistory
Set-PSReadlineKeyHandler -Key Ctrl+n -Function NextHistory
```    
Save, close and source your $PROFILE:
```
& $PROFILE
```     
Ta-da! Next time you open PWSH this will happen auto-magically.

fin.