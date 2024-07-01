#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsVmManagerStack } from '../lib/aws-vm-manager-stack';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const app = new cdk.App();

(async () => {
  try {
    // Fetch the public IP
    const response = await axios.get('http://checkip.amazonaws.com/');
    const laptopIp = response.data.trim();

    // Load configuration from YAML file
    const configPath = path.join(__dirname, '..', 'config', 'instances.yaml');
    const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as any;

    // Create the stack with the dynamic laptop IP
    new AwsVmManagerStack(app, 'AwsVmManagerStack', { laptopIp, config, env: { account: config.aws.account, region: config.aws.region } });

    app.synth();
  } catch (error) {
    console.error('Error fetching public IP:', error);
  }
})();

