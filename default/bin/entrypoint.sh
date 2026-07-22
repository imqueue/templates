#!/bin/sh
set -e

# A stable machine id is required for D-Bus-based service discovery / clustering.
MACHINE_UID="$(dbus-uuidgen)"
export MACHINE_UID
echo "$MACHINE_UID" > /etc/machine-id
echo "$MACHINE_UID" > /var/lib/dbus/machine-id

exec npm start
