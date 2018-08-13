#!/bin/bash

rsync -va -e 'ssh -p 442' dist/ lotech.org:/web/normal-tech.com/docma/
