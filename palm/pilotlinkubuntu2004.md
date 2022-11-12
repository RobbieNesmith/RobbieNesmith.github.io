---
title: Using Pilot Link on Ubuntu 20.04
description: How to set up pilot-link on Ubuntu 20.04
layout: markdown
---

After discovering a guide for building Palm OS apps on a modern OS, the next thing I needed to do was figure out how to get them on my Palms. There is no official Palm Desktop Software for Linux, but there are a few tools that exist to get the job done. This guide will walk you through how to use the `pilot-link` software with a USB Hotsync cradle.

## 1. Add Bionic Beaver repository to `apt` sources list

The `pilot-link`suite was removed from `apt`'s repositories before the release of Ubuntu 20.04, so we'll need to install it from the 18.04 repository.

To add the old repo, add a line to your `/etc/apt/sources.list` file containing `deb http://us.archive.ubuntu.com/ubuntu bionic main` then run `apt update` to detect the changes.

## 2. Enable `visor` module in the kernel
You will need the `visor` kernel module in order to bind the USB port to `/dev/ttyUSB0` and `/dev/ttyUSB1`. To check if you already have the module installed, run the command `lsmod | grep visor`. You can add the visor module on the fly by running `sudo modprobe visor` or by adding a line containing `visor` to `etc/modules`. If you add it to the modules file, you will also have to remove the line `blacklist visor` from `/etc/modprobe.d/libpisock9.conf`.

## 3. Add your user to the `dialout` group
To check if you are already a member of the group, you can run the `groups` command and check if `dialout` is in the list of groups. Run the command `usermod -a -G dialout yourUserName` to add yourself to the `dialout` group. This will allow you to access the USB ports used by the Palm. Once you have done this, restart your computer.

## 4. Sync your Palm
When you sync your Palm, make sure to press the Hotsync button first, and then run your command.

## Sources

- [`pilot-link` man page](https://linux.die.net/man/7/pilot-link)
- [Using Handspring Visor with Linux](https://tldp.org/HOWTO/Handspring-Visor/)