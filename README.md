# AWS VM Manager

AWS VM Manager is a personal project designed to automate the creation and management of EC2 instances for experimentation purposes. It uses AWS CDK (Cloud Development Kit) with TypeScript to define and deploy the infrastructure as code.

## Table of Contents
- [Motivation](#motivation)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Motivation

I frequently spin up EC2 instances for personal testing, requiring security groups to allow inbound traffic from my network's public IP. This project automates this setup process while providing an opportunity to learn and implement CDK.

## Features

### CDK Script
1. Generates a new SSH key and creates a new key pair
2. Creates EC2 instances using the new key pair
3. Sets up a Security Group to allow inbound traffic from your router's public IP address

### Shell Script
1. Lists EC2 instances' SSH configurations
2. Generates an SSH config file for easy access
3. Displays instance status (running, stopped, etc.)
4. Provides a formatted table with instance details

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js and npm**: [Download and install Node.js](https://nodejs.org/)
- **AWS CLI**: [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- **AWS CDK**: Install the AWS CDK toolkit globally using npm:
  ```bash
  npm install -g aws-cdk
    ```

## Setup

### 1. Clone the repository:

```bash
git clone <repository-url>
cd aws-vm-manager
```
### 2. Install dependencies:

```bash
npm install
```

### 3. Create the configuration file:
Update the `config/instances.yaml` file with the following content:

```yaml
aws:
  account: "" # your aws account id here
  region: "us-east-1"

keyPair:
  name: "MyKeyPair"
  path: "/path/to/my/keypair.pem"

instances:
  - name: "one"
    type: "t2.micro"
  - name: "two"
    type: "t2.micro"
```
Replace `/path/to/my/keypair.pem` with the actual path where you want to store your key pair file.

### 4. Usage

#### 4.1 Update `env` config in `bin/aws-vm-manager.ts` and Deploy the stack:

```bash
cdk deploy
```
This script fetches your laptop's public IP dynamically and uses it to configure the security group rules.

#### 4.2 Destroy the Stack
Destroy the stack to remove all resources:
```bash
cdk destroy
```

#### 4.3 List instances
```bash
sh scripts/list.sh
```

This will print the following information and generate a ssh config file to use with vscode or Ansible.

```bash
Instance Name        Public IP       Status          SSH Command                                       
----------------------------------------------------------------------------------------------------
master               <ip_address>   running         ssh -i <path_to_pem_file> ubuntu@<ip_address>
worker1              <ip_address>    running         ssh -i <path_to_pem_file> ubuntu@<ip_address>

SSH config file generated at ./ssh_config

```
### Project Structure

- `bin/aws-vm-manager.ts`: Entry point for the CDK application.
- `lib/aws-vm-manager-stack.ts`: Main stack definition.
- `lib/key-pair.ts`: Key pair creation and management.
- `lib/vpc.ts`: VPC configuration.
- `lib/security-group.ts`: Security group configuration.
- `lib/ec2.ts`: EC2 instances configuration.
- `config/instances.yaml`: Configuration file for EC2 instances and key pair.

### Troubleshooting

#### Common Issues
**Public IP not fetched**: Ensure you have an active internet connection and that the service http://checkip.amazonaws.com/ is accessible.
**AWS CLI not configured**: Ensure your AWS CLI is configured with the necessary credentials and region.
**Logs and Debugging**: Check the terminal output for any errors during deployment. AWS CloudFormation console can also provide detailed logs for stack events and resource creation issues.

### Contributing

If you wish to contribute to this project, please create a pull request or open an issue on the repository.

### License

This project is licensed under the MIT License.