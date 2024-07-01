import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { KeyPair } from './key-pair';
import { Vpc } from './vpc';
import { Ec2 } from './ec2';
import { SecurityGroup } from './security-group';
import * as path from 'path';
export interface AwsVmManagerStackProps extends cdk.StackProps {
  laptopIp: string;
  config: any;
}

export class AwsVmManagerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsVmManagerStackProps) {
    super(scope, id, props);

    const { laptopIp, config } = props;

    const keyPair = new KeyPair(this, 'KeyPair', {
      keyName: config.keyPair.name,
      keyPath: config.keyPair.path,
    });

    const vpc = new Vpc(this, 'Vpc');

    const securityGroup = new SecurityGroup(this, 'SecurityGroup', {
      vpc: vpc.vpc,
      laptopIp,
    });

    new Ec2(this, 'Ec2Instances', {
      vpc: vpc.vpc,
      securityGroup: securityGroup.securityGroup,
      keyName: keyPair.keyName,
      config: config,
    });
  }
}