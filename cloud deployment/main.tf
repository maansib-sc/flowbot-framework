// Config
data "external" "conf" {
  program = ["cat", "config.json"]
}

output "conf" {
  value = data.external.conf.result
}

// Added DNS Made easy provider source
terraform {
  required_providers {
    dme = {
      source = "dnsmadeeasy/dme"
    }
  }
}

// Configure the Google Cloud provider
provider "google" {
  credentials = file("service-account.json")
  project     = data.external.conf.result.GCP_PROJECT
  region      = data.external.conf.result.GCP_REGION
}

// Configure the DNS Made Easy provider
provider "dme" {
  api_key    = data.external.conf.result.DME_API
  secret_key = data.external.conf.result.DME_SECRET
}

# Define local variables
locals {
  domain    = data.external.conf.result.DOMAIN
  subdomain = data.external.conf.result.SUBDOMAIN
  host      = data.external.conf.result.HOST
}

// Configure the Domain to be used
data "dme_domain" "domain" {
  name = local.domain
}

// Terraform plugin for creating random ids
resource "random_id" "instance_id" {
  byte_length = 8
}

// A single Compute Engine instance
resource "google_compute_instance" "default" {
  name         = "${local.subdomain}-${random_id.instance_id.hex}"
  machine_type = "custom-2-4096"
  zone         = data.external.conf.result.GCP_ZONE

  boot_disk {
    initialize_params {
      image = "ubuntu-2004-lts"
    }
  }

  metadata = {
    ssh-keys = "ubuntu:${file("key.pub")}"
  }

  // Make sure docker is installed on all new instances for later steps
  metadata_startup_script = templatefile("install.sh", { host : local.host })

  network_interface {
    network = "default"

    access_config {
      // Include this section to give the VM an external ip address
    }
  }
}

# Define local variables
locals {
  vm_ip = google_compute_instance.default.network_interface.0.access_config.0.nat_ip
}

// Allow HTTP and HTTPS access to VM
resource "google_compute_firewall" "default" {
  name    = "allow-http-https-${local.subdomain}"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_tags = ["default"]
}

// Add a DNS record to specified domain
resource "dme_dns_record" "main" {
  domain_id = data.dme_domain.domain.id
  name      = local.subdomain
  type      = "A"
  ttl       = "1800"
  value     = local.vm_ip
}

// Add a DNS record to specified domain
resource "dme_dns_record" "wildcard" {
  count     = data.external.conf.result.WILDCARD == "yes" ? 1 : 0
  domain_id = data.dme_domain.domain.id
  name      = "*.${local.subdomain}"
  type      = "A"
  ttl       = "1800"
  value     = local.vm_ip
}

// A variable for extracting the external IP address of the instance
output "ip" {
  value = local.vm_ip
}

output "host" {
  value = "http://${local.host}"
}