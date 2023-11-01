#!/bin/bash

# Install docker 
curl -fsSL https://get.docker.com | sh

# Add user to docker group
sudo usermod -aG docker $USER

