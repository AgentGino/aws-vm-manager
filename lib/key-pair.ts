import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import { Construct } from 'constructs';

export interface KeyPairProps {
  keyName: string;
  keyPath: string;
}

export class KeyPair extends Construct {
  public readonly keyName: string;

  constructor(scope: Construct, id: string, props: KeyPairProps) {
    super(scope, id);

    this.keyName = props.keyName;
    const keyPath = props.keyPath;

    // Check if the key pair file exists locally, generate if not
    if (!fs.existsSync(keyPath)) {
      console.log(`Key pair file not found at path: ${keyPath}. Generating new key pair...`);
      child_process.execSync(`ssh-keygen -t rsa -b 2048 -f ${keyPath} -q -N ""`);
      console.log(`Key pair generated at path: ${keyPath}`);
    }

    // Read the public key
    const publicKeyPath = `${keyPath}.pub`;
    if (!fs.existsSync(publicKeyPath)) {
      throw new Error(`Public key file not found at path: ${publicKeyPath}`);
    }
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    // Create the key pair in AWS
    const keyPair = new ec2.CfnKeyPair(this, 'KeyPair', {
        keyName: this.keyName,
        publicKeyMaterial: publicKey,
      });
  
      // Set removal policy to destroy
      keyPair.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}